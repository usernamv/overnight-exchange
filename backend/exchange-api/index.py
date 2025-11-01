"""
Business: API for crypto exchange operations - create/track exchanges, manage clients, get rates
Args: event with httpMethod, body, queryStringParameters; context with request_id
Returns: HTTP response with exchange data, client info, or rates
"""

import json
import os
from datetime import datetime
from typing import Dict, Any, List, Optional
from decimal import Decimal
import psycopg2
from psycopg2.extras import RealDictCursor

def get_db_connection():
    return psycopg2.connect(os.environ['DATABASE_URL'])

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id, X-Auth-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    conn = get_db_connection()
    
    try:
        if method == 'GET':
            params = event.get('queryStringParameters') or {}
            action = params.get('action', 'list_exchanges')
            
            if action == 'list_exchanges':
                return list_exchanges(conn, params)
            elif action == 'get_exchange':
                return get_exchange(conn, params.get('id'))
            elif action == 'list_clients':
                return list_clients(conn)
            elif action == 'get_rates':
                return get_rates(conn)
            elif action == 'list_currencies':
                return list_currencies(conn)
            
        elif method == 'POST':
            body = json.loads(event.get('body', '{}'))
            action = body.get('action')
            
            if action == 'create_exchange':
                return create_exchange(conn, body)
            elif action == 'create_client':
                return create_client(conn, body)
            elif action == 'update_rate':
                return update_rate(conn, body)
            
        elif method == 'PUT':
            body = json.loads(event.get('body', '{}'))
            exchange_id = body.get('id')
            return update_exchange_status(conn, exchange_id, body)
        
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Invalid action'}),
            'isBase64Encoded': False
        }
        
    finally:
        conn.close()

def list_exchanges(conn, params: Dict) -> Dict:
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    limit = int(params.get('limit', 50))
    offset = int(params.get('offset', 0))
    status = params.get('status')
    client_id = params.get('client_id')
    
    query = """
        SELECT e.*, c.email, c.full_name, c.telegram_username
        FROM exchanges e
        LEFT JOIN clients c ON e.client_id = c.id
        WHERE 1=1
    """
    
    if client_id:
        query += f" AND e.client_id = {client_id}"
    
    if status:
        query += f" AND e.status = '{status}'"
    
    query += f" ORDER BY e.created_at DESC LIMIT {limit} OFFSET {offset}"
    
    cursor.execute(query)
    exchanges = cursor.fetchall()
    
    count_query = "SELECT COUNT(*) as total FROM exchanges e WHERE 1=1"
    if client_id:
        count_query += f" AND e.client_id = {client_id}"
    if status:
        count_query += f" AND e.status = '{status}'"
    
    cursor.execute(count_query)
    total = cursor.fetchone()['total']
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({
            'exchanges': [dict(e) for e in exchanges],
            'total': total,
            'limit': limit,
            'offset': offset
        }, default=str),
        'isBase64Encoded': False
    }

def get_exchange(conn, exchange_id: str) -> Dict:
    if not exchange_id:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Exchange ID required'}),
            'isBase64Encoded': False
        }
    
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    cursor.execute("""
        SELECT e.*, c.email, c.full_name, c.phone
        FROM exchanges e
        LEFT JOIN clients c ON e.client_id = c.id
        WHERE e.id = %s
    """, (exchange_id,))
    
    exchange = cursor.fetchone()
    
    if not exchange:
        return {
            'statusCode': 404,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Exchange not found'}),
            'isBase64Encoded': False
        }
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'exchange': dict(exchange)}, default=str),
        'isBase64Encoded': False
    }

def create_exchange(conn, data: Dict) -> Dict:
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    client_id = data.get('client_id')
    from_amount = float(data['from_amount'])
    from_currency = data['from_currency']
    to_currency = data['to_currency']
    email = data.get('email', 'anonymous@exchange.com')
    telegram = data.get('telegram', '')
    
    if not client_id:
        cursor.execute("SELECT id FROM clients WHERE email = %s", (email,))
        existing_client = cursor.fetchone()
        
        if existing_client:
            client_id = existing_client['id']
        else:
            cursor.execute("""
                INSERT INTO clients (email, full_name, telegram_username) 
                VALUES (%s, %s, %s) 
                RETURNING id
            """, (email, data.get('name', 'Anonymous'), telegram))
            result = cursor.fetchone()
            client_id = result['id']
    
    cursor.execute("SELECT * FROM clients WHERE id = %s", (client_id,))
    client = cursor.fetchone()
    verification_level = client['verification_level'] or 'none'
    
    cursor.execute("""
        SELECT * FROM exchange_limits WHERE verification_level = %s
    """, (verification_level,))
    limits = cursor.fetchone()
    
    from_rate_usd = data.get('from_rate_usd', from_amount)
    amount_usd = from_amount * from_rate_usd
    
    if amount_usd > float(limits['single_transaction_limit_usd']):
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'success': False,
                'error': 'Amount exceeds limit',
                'limit': float(limits['single_transaction_limit_usd']),
                'verification_level': verification_level
            }),
            'isBase64Encoded': False
        }
    
    cursor.execute("""
        INSERT INTO exchanges 
        (client_id, from_currency, to_currency, from_amount, to_amount, exchange_rate, from_wallet, to_wallet, status, notes)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, 'pending', %s)
        RETURNING id, created_at
    """, (
        client_id,
        from_currency,
        to_currency,
        data['from_amount'],
        data['to_amount'],
        data['exchange_rate'],
        data.get('from_address', ''),
        data.get('to_address', ''),
        data.get('comment', '')
    ))
    
    result = cursor.fetchone()
    exchange_id = result['id']
    
    cursor.execute("""
        INSERT INTO transaction_logs (exchange_id, action, status_to, performed_by, notes)
        VALUES (%s, 'created', 'pending', 'system', 'Exchange created')
    """, (exchange_id,))
    
    cursor.execute("""
        INSERT INTO notifications (client_id, type, title, message)
        VALUES (%s, 'exchange_created', 'Exchange Created', %s)
    """, (client_id, f'Exchange {exchange_id}: {from_amount} {from_currency} -> {data["to_amount"]} {to_currency}'))
    
    conn.commit()
    
    return {
        'statusCode': 201,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({
            'success': True,
            'exchange_id': exchange_id,
            'client_id': client_id,
            'status': 'pending',
            'created_at': str(result['created_at'])
        }, default=str),
        'isBase64Encoded': False
    }

def update_exchange_status(conn, exchange_id: int, data: Dict) -> Dict:
    cursor = conn.cursor()
    
    status = data.get('status')
    transaction_hash = data.get('transaction_hash')
    
    query = "UPDATE exchanges SET status = %s"
    params = [status]
    
    if transaction_hash:
        query += ", transaction_hash = %s"
        params.append(transaction_hash)
    
    if status == 'completed':
        query += ", completed_at = CURRENT_TIMESTAMP"
    
    query += " WHERE id = %s"
    params.append(exchange_id)
    
    cursor.execute(query, params)
    conn.commit()
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'success': True, 'message': 'Exchange updated'}),
        'isBase64Encoded': False
    }

def list_clients(conn) -> Dict:
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    cursor.execute("""
        SELECT c.*, 
               COUNT(e.id) as total_exchanges,
               SUM(CASE WHEN e.status = 'completed' THEN 1 ELSE 0 END) as completed_exchanges
        FROM clients c
        LEFT JOIN exchanges e ON c.id = e.client_id
        GROUP BY c.id
        ORDER BY c.created_at DESC
    """)
    
    clients = cursor.fetchall()
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'clients': [dict(c) for c in clients]}, default=str),
        'isBase64Encoded': False
    }

def create_client(conn, data: Dict) -> Dict:
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    cursor.execute("""
        INSERT INTO clients (email, phone, full_name, telegram_username, wallet_addresses)
        VALUES (%s, %s, %s, %s, %s)
        RETURNING id, created_at
        ON CONFLICT (email) DO UPDATE SET
            phone = EXCLUDED.phone,
            full_name = EXCLUDED.full_name,
            telegram_username = EXCLUDED.telegram_username,
            updated_at = CURRENT_TIMESTAMP
        RETURNING id, created_at
    """, (
        data['email'],
        data.get('phone'),
        data.get('full_name'),
        data.get('telegram_username'),
        json.dumps(data.get('wallet_addresses', {}))
    ))
    
    result = cursor.fetchone()
    conn.commit()
    
    return {
        'statusCode': 201,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({
            'success': True,
            'client_id': result['id'],
            'created_at': str(result['created_at'])
        }, default=str),
        'isBase64Encoded': False
    }

def get_rates(conn) -> Dict:
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    cursor.execute("""
        SELECT * FROM exchange_rates
        WHERE updated_at > NOW() - INTERVAL '1 hour'
        ORDER BY updated_at DESC
    """)
    
    rates = cursor.fetchall()
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'rates': [dict(r) for r in rates]}, default=str),
        'isBase64Encoded': False
    }

def update_rate(conn, data: Dict) -> Dict:
    cursor = conn.cursor()
    
    cursor.execute("""
        INSERT INTO exchange_rates (from_currency, to_currency, rate, source)
        VALUES (%s, %s, %s, %s)
        ON CONFLICT (from_currency, to_currency, source) 
        DO UPDATE SET rate = EXCLUDED.rate, updated_at = CURRENT_TIMESTAMP
    """, (
        data['from_currency'],
        data['to_currency'],
        data['rate'],
        data.get('source', 'manual')
    ))
    
    conn.commit()
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'success': True, 'message': 'Rate updated'}),
        'isBase64Encoded': False
    }

def list_currencies(conn) -> Dict:
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    cursor.execute("SELECT * FROM currencies WHERE is_active = true ORDER BY type, symbol")
    
    currencies = cursor.fetchall()
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'currencies': [dict(c) for c in currencies]}, default=str),
        'isBase64Encoded': False
    }