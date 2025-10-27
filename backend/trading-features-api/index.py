"""
Business: Advanced trading features API - limit orders, referral system, price alerts, analytics
Args: event with httpMethod, body, queryStringParameters; context with request_id
Returns: HTTP response with trading data, referral info, or alerts
"""

import json
import os
import random
import string
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
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    conn = get_db_connection()
    
    try:
        if method == 'GET':
            params = event.get('queryStringParameters') or {}
            action = params.get('action')
            
            if action == 'get_referral_code':
                return get_referral_code(conn, params.get('client_id'))
            elif action == 'check_referral_code':
                return check_referral_code(conn, params.get('code'))
            elif action == 'get_referral_stats':
                return get_referral_stats(conn, params.get('client_id'))
            elif action == 'list_limit_orders':
                return list_limit_orders(conn, params)
            elif action == 'get_price_alerts':
                return get_price_alerts(conn, params.get('client_id'))
            elif action == 'get_trading_analytics':
                return get_trading_analytics(conn, params)
            
        elif method == 'POST':
            body = json.loads(event.get('body', '{}'))
            action = body.get('action')
            
            if action == 'create_referral_code':
                return create_referral_code(conn, body)
            elif action == 'use_referral_code':
                return use_referral_code(conn, body)
            elif action == 'create_limit_order':
                return create_limit_order(conn, body)
            elif action == 'create_price_alert':
                return create_price_alert(conn, body)
            
        elif method == 'PUT':
            body = json.loads(event.get('body', '{}'))
            if body.get('action') == 'cancel_limit_order':
                return cancel_limit_order(conn, body.get('order_id'))
            
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Invalid action'}),
            'isBase64Encoded': False
        }
        
    finally:
        conn.close()

def generate_referral_code() -> str:
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))

def create_referral_code(conn, data: Dict) -> Dict:
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    client_id = data['client_id']
    
    cursor.execute("""
        SELECT code FROM referral_codes WHERE client_id = %s AND is_active = true
    """, (client_id,))
    
    existing = cursor.fetchone()
    if existing:
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'success': True,
                'code': existing['code'],
                'message': 'Referral code already exists'
            }),
            'isBase64Encoded': False
        }
    
    code = generate_referral_code()
    discount = data.get('discount_percent', 0)
    commission = data.get('commission_percent', 10)
    
    cursor.execute("""
        INSERT INTO referral_codes (client_id, code, discount_percent, commission_percent)
        VALUES (%s, %s, %s, %s)
        RETURNING id, code
    """, (client_id, code, discount, commission))
    
    result = cursor.fetchone()
    conn.commit()
    
    return {
        'statusCode': 201,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({
            'success': True,
            'referral_id': result['id'],
            'code': result['code']
        }),
        'isBase64Encoded': False
    }

def get_referral_code(conn, client_id: str) -> Dict:
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    cursor.execute("""
        SELECT * FROM referral_codes 
        WHERE client_id = %s AND is_active = true
    """, (client_id,))
    
    code = cursor.fetchone()
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'referral_code': dict(code) if code else None}, default=str),
        'isBase64Encoded': False
    }

def check_referral_code(conn, code: str) -> Dict:
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    cursor.execute("""
        SELECT rc.*, c.full_name, c.email
        FROM referral_codes rc
        JOIN clients c ON rc.client_id = c.id
        WHERE rc.code = %s AND rc.is_active = true
    """, (code,))
    
    referral = cursor.fetchone()
    
    if not referral:
        return {
            'statusCode': 404,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'valid': False, 'error': 'Invalid referral code'}),
            'isBase64Encoded': False
        }
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({
            'valid': True,
            'discount_percent': float(referral['discount_percent']),
            'referrer_name': referral['full_name']
        }, default=str),
        'isBase64Encoded': False
    }

def use_referral_code(conn, data: Dict) -> Dict:
    cursor = conn.cursor()
    
    code = data['code']
    exchange_id = data['exchange_id']
    commission_usd = data['commission_usd']
    
    cursor.execute("""
        SELECT id, client_id FROM referral_codes WHERE code = %s AND is_active = true
    """, (code,))
    
    referral = cursor.fetchone()
    if not referral:
        return {
            'statusCode': 404,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Invalid referral code'}),
            'isBase64Encoded': False
        }
    
    referral_id, referrer_id = referral
    
    cursor.execute("""
        SELECT client_id FROM exchanges WHERE id = %s
    """, (exchange_id,))
    referred_client = cursor.fetchone()
    
    cursor.execute("""
        INSERT INTO referral_usage (referral_code_id, referred_client_id, exchange_id, commission_usd)
        VALUES (%s, %s, %s, %s)
    """, (referral_id, referred_client[0], exchange_id, commission_usd))
    
    cursor.execute("""
        UPDATE referral_codes 
        SET total_referrals = total_referrals + 1,
            total_earnings_usd = total_earnings_usd + %s
        WHERE id = %s
    """, (commission_usd, referral_id))
    
    conn.commit()
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'success': True, 'commission_earned': float(commission_usd)}),
        'isBase64Encoded': False
    }

def get_referral_stats(conn, client_id: str) -> Dict:
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    cursor.execute("""
        SELECT 
            rc.*,
            COUNT(ru.id) as usage_count,
            SUM(ru.commission_usd) as total_commission
        FROM referral_codes rc
        LEFT JOIN referral_usage ru ON rc.id = ru.referral_code_id
        WHERE rc.client_id = %s
        GROUP BY rc.id
    """, (client_id,))
    
    stats = cursor.fetchone()
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'stats': dict(stats) if stats else None}, default=str),
        'isBase64Encoded': False
    }

def create_limit_order(conn, data: Dict) -> Dict:
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    cursor.execute("""
        INSERT INTO limit_orders 
        (client_id, from_currency, to_currency, from_amount, target_rate, expiry_date)
        VALUES (%s, %s, %s, %s, %s, %s)
        RETURNING id
    """, (
        data['client_id'],
        data['from_currency'],
        data['to_currency'],
        data['from_amount'],
        data['target_rate'],
        data.get('expiry_date')
    ))
    
    result = cursor.fetchone()
    conn.commit()
    
    return {
        'statusCode': 201,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({
            'success': True,
            'order_id': result['id'],
            'message': 'Limit order created'
        }),
        'isBase64Encoded': False
    }

def list_limit_orders(conn, params: Dict) -> Dict:
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    client_id = params.get('client_id')
    status = params.get('status', 'active')
    
    query = "SELECT * FROM limit_orders WHERE client_id = %s"
    query_params = [client_id]
    
    if status != 'all':
        query += " AND status = %s"
        query_params.append(status)
    
    query += " ORDER BY created_at DESC"
    
    cursor.execute(query, query_params)
    orders = cursor.fetchall()
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'orders': [dict(o) for o in orders]}, default=str),
        'isBase64Encoded': False
    }

def cancel_limit_order(conn, order_id: int) -> Dict:
    cursor = conn.cursor()
    
    cursor.execute("""
        UPDATE limit_orders SET status = 'cancelled' WHERE id = %s AND status = 'active'
    """, (order_id,))
    
    conn.commit()
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'success': True, 'message': 'Order cancelled'}),
        'isBase64Encoded': False
    }

def create_price_alert(conn, data: Dict) -> Dict:
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    cursor.execute("""
        INSERT INTO price_alerts (client_id, currency, target_price, condition)
        VALUES (%s, %s, %s, %s)
        RETURNING id
    """, (
        data['client_id'],
        data['currency'],
        data['target_price'],
        data['condition']
    ))
    
    result = cursor.fetchone()
    conn.commit()
    
    return {
        'statusCode': 201,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({
            'success': True,
            'alert_id': result['id'],
            'message': 'Price alert created'
        }),
        'isBase64Encoded': False
    }

def get_price_alerts(conn, client_id: str) -> Dict:
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    cursor.execute("""
        SELECT * FROM price_alerts 
        WHERE client_id = %s AND is_active = true
        ORDER BY created_at DESC
    """, (client_id,))
    
    alerts = cursor.fetchall()
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'alerts': [dict(a) for a in alerts]}, default=str),
        'isBase64Encoded': False
    }

def get_trading_analytics(conn, params: Dict) -> Dict:
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    currency_pair = params.get('currency_pair', 'BTC-USDT')
    days = int(params.get('days', 7))
    
    cursor.execute("""
        SELECT * FROM trading_analytics 
        WHERE currency_pair = %s 
        AND date >= CURRENT_DATE - INTERVAL '%s days'
        ORDER BY date DESC
    """, (currency_pair, days))
    
    analytics = cursor.fetchall()
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'analytics': [dict(a) for a in analytics]}, default=str),
        'isBase64Encoded': False
    }
