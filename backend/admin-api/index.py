"""
Business: Admin API for managing rate sources, sponsors, settings, and currencies
Args: event with httpMethod, body, queryStringParameters; context with request_id
Returns: HTTP response with admin data or operation results
"""

import json
import os
from typing import Dict, Any
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
                'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    conn = get_db_connection()
    
    try:
        if method == 'GET':
            params = event.get('queryStringParameters') or {}
            resource = params.get('resource', 'dashboard')
            
            if resource == 'dashboard':
                return get_dashboard_stats(conn)
            elif resource == 'rate_sources':
                return list_rate_sources(conn)
            elif resource == 'sponsors':
                return list_sponsors(conn)
            elif resource == 'settings':
                return list_settings(conn)
            elif resource == 'currencies':
                return list_all_currencies(conn)
            
        elif method == 'POST':
            body = json.loads(event.get('body', '{}'))
            resource = body.get('resource')
            
            if resource == 'rate_source':
                return create_rate_source(conn, body)
            elif resource == 'sponsor':
                return create_sponsor(conn, body)
            elif resource == 'currency':
                return create_currency(conn, body)
            elif resource == 'setting':
                return update_setting(conn, body)
            
        elif method == 'PUT':
            body = json.loads(event.get('body', '{}'))
            resource = body.get('resource')
            
            if resource == 'rate_source':
                return update_rate_source(conn, body)
            elif resource == 'sponsor':
                return update_sponsor(conn, body)
            elif resource == 'currency':
                return update_currency(conn, body)
            
        elif method == 'DELETE':
            params = event.get('queryStringParameters') or {}
            resource = params.get('resource')
            item_id = params.get('id')
            
            if resource == 'sponsor':
                return delete_sponsor(conn, item_id)
            elif resource == 'rate_source':
                return delete_rate_source(conn, item_id)
        
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Invalid resource or action'}),
            'isBase64Encoded': False
        }
        
    finally:
        conn.close()

def get_dashboard_stats(conn) -> Dict:
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    cursor.execute("""
        SELECT 
            COUNT(*) as total_exchanges,
            COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_exchanges,
            COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_exchanges,
            COUNT(CASE WHEN status = 'failed' THEN 1 END) as failed_exchanges,
            SUM(CASE WHEN status = 'completed' THEN from_amount ELSE 0 END) as total_volume
        FROM exchanges
    """)
    exchange_stats = cursor.fetchone()
    
    cursor.execute("SELECT COUNT(*) as total_clients FROM clients WHERE is_active = true")
    client_stats = cursor.fetchone()
    
    cursor.execute("""
        SELECT from_currency, to_currency, COUNT(*) as count
        FROM exchanges
        WHERE status = 'completed'
        GROUP BY from_currency, to_currency
        ORDER BY count DESC
        LIMIT 5
    """)
    popular_pairs = cursor.fetchall()
    
    cursor.execute("""
        SELECT DATE(created_at) as date, COUNT(*) as count
        FROM exchanges
        WHERE created_at > NOW() - INTERVAL '30 days'
        GROUP BY DATE(created_at)
        ORDER BY date DESC
    """)
    daily_exchanges = cursor.fetchall()
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({
            'exchange_stats': dict(exchange_stats),
            'total_clients': client_stats['total_clients'],
            'popular_pairs': [dict(p) for p in popular_pairs],
            'daily_exchanges': [dict(d) for d in daily_exchanges]
        }, default=str),
        'isBase64Encoded': False
    }

def list_rate_sources(conn) -> Dict:
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    cursor.execute("SELECT * FROM rate_sources ORDER BY priority, name")
    sources = cursor.fetchall()
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'rate_sources': [dict(s) for s in sources]}, default=str),
        'isBase64Encoded': False
    }

def create_rate_source(conn, data: Dict) -> Dict:
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    cursor.execute("""
        INSERT INTO rate_sources (name, api_url, api_key_required, is_active, priority)
        VALUES (%s, %s, %s, %s, %s)
        RETURNING id
    """, (
        data['name'],
        data['api_url'],
        data.get('api_key_required', False),
        data.get('is_active', True),
        data.get('priority', 1)
    ))
    
    result = cursor.fetchone()
    conn.commit()
    
    return {
        'statusCode': 201,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'success': True, 'id': result['id']}),
        'isBase64Encoded': False
    }

def update_rate_source(conn, data: Dict) -> Dict:
    cursor = conn.cursor()
    
    cursor.execute("""
        UPDATE rate_sources 
        SET name = %s, api_url = %s, api_key_required = %s, is_active = %s, priority = %s
        WHERE id = %s
    """, (
        data['name'],
        data['api_url'],
        data['api_key_required'],
        data['is_active'],
        data['priority'],
        data['id']
    ))
    
    conn.commit()
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'success': True, 'message': 'Rate source updated'}),
        'isBase64Encoded': False
    }

def delete_rate_source(conn, source_id: str) -> Dict:
    cursor = conn.cursor()
    cursor.execute("DELETE FROM rate_sources WHERE id = %s", (source_id,))
    conn.commit()
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'success': True, 'message': 'Rate source deleted'}),
        'isBase64Encoded': False
    }

def list_sponsors(conn) -> Dict:
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    cursor.execute("SELECT * FROM sponsors ORDER BY display_order, name")
    sponsors = cursor.fetchall()
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'sponsors': [dict(s) for s in sponsors]}, default=str),
        'isBase64Encoded': False
    }

def create_sponsor(conn, data: Dict) -> Dict:
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    cursor.execute("""
        INSERT INTO sponsors (name, logo_url, website_url, description, is_active, display_order)
        VALUES (%s, %s, %s, %s, %s, %s)
        RETURNING id
    """, (
        data['name'],
        data.get('logo_url'),
        data.get('website_url'),
        data.get('description'),
        data.get('is_active', True),
        data.get('display_order', 0)
    ))
    
    result = cursor.fetchone()
    conn.commit()
    
    return {
        'statusCode': 201,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'success': True, 'id': result['id']}),
        'isBase64Encoded': False
    }

def update_sponsor(conn, data: Dict) -> Dict:
    cursor = conn.cursor()
    
    cursor.execute("""
        UPDATE sponsors 
        SET name = %s, logo_url = %s, website_url = %s, description = %s, 
            is_active = %s, display_order = %s
        WHERE id = %s
    """, (
        data['name'],
        data.get('logo_url'),
        data.get('website_url'),
        data.get('description'),
        data['is_active'],
        data['display_order'],
        data['id']
    ))
    
    conn.commit()
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'success': True, 'message': 'Sponsor updated'}),
        'isBase64Encoded': False
    }

def delete_sponsor(conn, sponsor_id: str) -> Dict:
    cursor = conn.cursor()
    cursor.execute("DELETE FROM sponsors WHERE id = %s", (sponsor_id,))
    conn.commit()
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'success': True, 'message': 'Sponsor deleted'}),
        'isBase64Encoded': False
    }

def list_settings(conn) -> Dict:
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    cursor.execute("SELECT * FROM admin_settings ORDER BY setting_key")
    settings = cursor.fetchall()
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'settings': [dict(s) for s in settings]}, default=str),
        'isBase64Encoded': False
    }

def update_setting(conn, data: Dict) -> Dict:
    cursor = conn.cursor()
    
    cursor.execute("""
        INSERT INTO admin_settings (setting_key, setting_value, description)
        VALUES (%s, %s, %s)
        ON CONFLICT (setting_key) 
        DO UPDATE SET setting_value = EXCLUDED.setting_value, updated_at = CURRENT_TIMESTAMP
    """, (
        data['setting_key'],
        data['setting_value'],
        data.get('description', '')
    ))
    
    conn.commit()
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'success': True, 'message': 'Setting updated'}),
        'isBase64Encoded': False
    }

def list_all_currencies(conn) -> Dict:
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    cursor.execute("SELECT * FROM currencies ORDER BY type, symbol")
    currencies = cursor.fetchall()
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'currencies': [dict(c) for c in currencies]}, default=str),
        'isBase64Encoded': False
    }

def create_currency(conn, data: Dict) -> Dict:
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    cursor.execute("""
        INSERT INTO currencies (symbol, name, type, icon_emoji, decimals, is_active)
        VALUES (%s, %s, %s, %s, %s, %s)
        RETURNING id
    """, (
        data['symbol'],
        data['name'],
        data['type'],
        data.get('icon_emoji'),
        data.get('decimals', 8),
        data.get('is_active', True)
    ))
    
    result = cursor.fetchone()
    conn.commit()
    
    return {
        'statusCode': 201,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'success': True, 'id': result['id']}),
        'isBase64Encoded': False
    }

def update_currency(conn, data: Dict) -> Dict:
    cursor = conn.cursor()
    
    cursor.execute("""
        UPDATE currencies 
        SET name = %s, type = %s, icon_emoji = %s, decimals = %s, is_active = %s
        WHERE symbol = %s
    """, (
        data['name'],
        data['type'],
        data.get('icon_emoji'),
        data['decimals'],
        data['is_active'],
        data['symbol']
    ))
    
    conn.commit()
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'success': True, 'message': 'Currency updated'}),
        'isBase64Encoded': False
    }
