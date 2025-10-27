"""
Business: Admin API for managing rate sources, sponsors, settings, currencies, commissions, and payment providers
Args: event with httpMethod, body, queryStringParameters; context with request_id
Returns: HTTP response with admin data or operation results
"""

import json
import os
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor
import requests
from decimal import Decimal
from datetime import datetime

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
            elif resource == 'commissions':
                return get_commission_settings(conn)
            elif resource == 'site_content':
                category = params.get('category')
                return get_site_content(conn, category)
            elif resource == 'payment_providers':
                return get_payment_providers(conn)
            elif resource == 'system_settings':
                return get_system_settings(conn)
            elif resource == 'payment_transaction':
                tx_id = params.get('id')
                return get_transaction_status(conn, tx_id)
            
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
            elif resource == 'commission':
                return create_commission_setting(conn, body)
            elif resource == 'site_content':
                return create_site_content(conn, body)
            elif resource == 'payment':
                return create_payment(conn, body)
            elif resource == 'webhook':
                provider_name = body.get('provider')
                return handle_webhook(conn, provider_name, body, event.get('headers', {}))
            
        elif method == 'PUT':
            body = json.loads(event.get('body', '{}'))
            resource = body.get('resource')
            
            if resource == 'rate_source':
                return update_rate_source(conn, body)
            elif resource == 'sponsor':
                return update_sponsor(conn, body)
            elif resource == 'currency':
                return update_currency(conn, body)
            elif resource == 'commission':
                return update_commission_setting(conn, body)
            elif resource == 'site_content':
                return update_site_content(conn, body)
            elif resource == 'system_setting':
                return update_system_setting(conn, body)
            elif resource == 'payment_provider':
                return update_provider_config(conn, body)
            
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

def get_commission_settings(conn) -> Dict:
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    cursor.execute("""
        SELECT id, from_currency, to_currency, commission_percent, 
               min_commission, max_commission, is_active
        FROM commission_settings
        ORDER BY from_currency, to_currency
    """)
    commissions = cursor.fetchall()
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'commissions': [dict(c) for c in commissions]}, default=str),
        'isBase64Encoded': False
    }

def create_commission_setting(conn, data: Dict) -> Dict:
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    cursor.execute("""
        INSERT INTO commission_settings 
        (from_currency, to_currency, commission_percent, min_commission, max_commission, is_active)
        VALUES (%s, %s, %s, %s, %s, %s)
        RETURNING id
    """, (data['from_currency'], data['to_currency'], data['commission_percent'],
          data.get('min_commission', 0), data.get('max_commission'), data.get('is_active', True)))
    
    result = cursor.fetchone()
    conn.commit()
    
    return {
        'statusCode': 201,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'success': True, 'id': result['id']}),
        'isBase64Encoded': False
    }

def update_commission_setting(conn, data: Dict) -> Dict:
    cursor = conn.cursor()
    
    cursor.execute("""
        UPDATE commission_settings
        SET commission_percent = COALESCE(%s, commission_percent),
            min_commission = COALESCE(%s, min_commission),
            max_commission = COALESCE(%s, max_commission),
            is_active = COALESCE(%s, is_active),
            updated_at = CURRENT_TIMESTAMP
        WHERE id = %s
    """, (data.get('commission_percent'), data.get('min_commission'), 
          data.get('max_commission'), data.get('is_active'), data['id']))
    
    conn.commit()
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'success': True, 'message': 'Commission updated'}),
        'isBase64Encoded': False
    }

def get_site_content(conn, category=None) -> Dict:
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    if category:
        cursor.execute("""
            SELECT id, key, value, type, category, description, is_active
            FROM site_content WHERE category = %s ORDER BY key
        """, (category,))
    else:
        cursor.execute("""
            SELECT id, key, value, type, category, description, is_active
            FROM site_content ORDER BY category, key
        """)
    
    content_items = cursor.fetchall()
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'content': [dict(c) for c in content_items]}, default=str),
        'isBase64Encoded': False
    }

def create_site_content(conn, data: Dict) -> Dict:
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    cursor.execute("""
        INSERT INTO site_content (key, value, type, category, description, is_active)
        VALUES (%s, %s, %s, %s, %s, %s)
        RETURNING id
    """, (data['key'], data['value'], data.get('type', 'text'),
          data.get('category', 'general'), data.get('description', ''), data.get('is_active', True)))
    
    result = cursor.fetchone()
    conn.commit()
    
    return {
        'statusCode': 201,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'success': True, 'id': result['id']}),
        'isBase64Encoded': False
    }

def update_site_content(conn, data: Dict) -> Dict:
    cursor = conn.cursor()
    
    cursor.execute("""
        UPDATE site_content
        SET value = COALESCE(%s, value),
            is_active = COALESCE(%s, is_active),
            updated_at = CURRENT_TIMESTAMP
        WHERE id = %s
    """, (data.get('value'), data.get('is_active'), data['id']))
    
    conn.commit()
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'success': True, 'message': 'Content updated'}),
        'isBase64Encoded': False
    }

def get_system_settings(conn) -> Dict:
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    cursor.execute("""
        SELECT id, key, value, value_type, category, description, is_editable
        FROM system_settings ORDER BY category, key
    """)
    
    settings = []
    for row in cursor.fetchall():
        setting = dict(row)
        value = setting['value']
        if setting['value_type'] == 'number':
            value = float(value) if '.' in value else int(value)
        elif setting['value_type'] == 'boolean':
            value = value.lower() == 'true'
        elif setting['value_type'] == 'json':
            value = json.loads(value)
        setting['value'] = value
        settings.append(setting)
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'settings': settings}, default=str),
        'isBase64Encoded': False
    }

def update_system_setting(conn, data: Dict) -> Dict:
    cursor = conn.cursor()
    
    value = data['value']
    if isinstance(value, bool):
        value_str = 'true' if value else 'false'
    elif isinstance(value, (dict, list)):
        value_str = json.dumps(value)
    else:
        value_str = str(value)
    
    cursor.execute("""
        UPDATE system_settings
        SET value = %s, updated_at = CURRENT_TIMESTAMP
        WHERE key = %s AND is_editable = true
    """, (value_str, data['key']))
    
    conn.commit()
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'success': True, 'message': 'Setting updated'}),
        'isBase64Encoded': False
    }

def get_payment_providers(conn) -> Dict:
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    cursor.execute("""
        SELECT id, name, type, is_active, supported_currencies, config
        FROM payment_providers ORDER BY name
    """)
    providers = cursor.fetchall()
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'providers': [dict(p) for p in providers]}, default=str),
        'isBase64Encoded': False
    }

def update_provider_config(conn, data: Dict) -> Dict:
    cursor = conn.cursor()
    
    cursor.execute("""
        UPDATE payment_providers
        SET is_active = COALESCE(%s, is_active),
            config = COALESCE(%s::jsonb, config),
            updated_at = CURRENT_TIMESTAMP
        WHERE id = %s
    """, (data.get('is_active'), json.dumps(data.get('config')) if data.get('config') else None, data['provider_id']))
    
    conn.commit()
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'success': True, 'message': 'Provider updated'}),
        'isBase64Encoded': False
    }

def create_payment(conn, data: Dict) -> Dict:
    exchange_id = data.get('exchange_id')
    provider_id = data.get('provider_id')
    amount = Decimal(str(data.get('amount')))
    currency = data.get('currency')
    
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    cursor.execute("""
        SELECT name, type, api_key_placeholder, config
        FROM payment_providers WHERE id = %s AND is_active = true
    """, (provider_id,))
    
    provider = cursor.fetchone()
    if not provider:
        return {
            'statusCode': 404,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Provider not found or inactive'}),
            'isBase64Encoded': False
        }
    
    provider_type = provider['type']
    api_key_secret = os.environ.get(f'{provider_type.upper()}_API_KEY', '')
    
    payment_url = f'https://payment.mock/{currency}'
    external_tx_id = f'mock_{provider_type}_{datetime.now().timestamp()}'
    payment_address = f'mock_address_{currency}'
    
    cursor.execute("""
        INSERT INTO payment_provider_transactions 
        (provider_id, exchange_id, external_transaction_id, payment_url, 
         amount, currency, payment_address, required_confirmations, metadata)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        RETURNING id
    """, (provider_id, exchange_id, external_tx_id, payment_url, 
          amount, currency, payment_address, 3, json.dumps({'provider_name': provider['name']})))
    
    tx_id = cursor.fetchone()['id']
    conn.commit()
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({
            'transaction_id': tx_id,
            'payment_url': payment_url,
            'payment_address': payment_address,
            'amount': str(amount),
            'currency': currency,
            'provider': provider['name']
        }),
        'isBase64Encoded': False
    }

def handle_webhook(conn, provider_name: str, data: Dict, headers: Dict) -> Dict:
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    external_tx_id = data.get('id') or data.get('payment_id') or data.get('txn_id')
    status = data.get('status', 'pending')
    
    status_map = {
        'confirmed': 'completed',
        'completed': 'completed',
        'finished': 'completed',
        'pending': 'processing',
        'waiting': 'processing',
        'expired': 'expired',
        'failed': 'failed'
    }
    
    mapped_status = status_map.get(status.lower(), 'processing')
    
    cursor.execute("""
        UPDATE payment_provider_transactions
        SET status = %s, webhook_data = %s::jsonb, confirmations = %s,
            updated_at = CURRENT_TIMESTAMP,
            completed_at = CASE WHEN %s = 'completed' THEN CURRENT_TIMESTAMP ELSE completed_at END
        WHERE external_transaction_id = %s
        RETURNING id, exchange_id
    """, (mapped_status, json.dumps(data), data.get('confirmations', 0), mapped_status, external_tx_id))
    
    result = cursor.fetchone()
    
    if result and mapped_status == 'completed':
        cursor.execute("""
            UPDATE exchanges SET status = 'completed', completed_at = CURRENT_TIMESTAMP
            WHERE id = %s
        """, (result['exchange_id'],))
    
    conn.commit()
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'status': 'webhook_received'}),
        'isBase64Encoded': False
    }

def get_transaction_status(conn, tx_id: str) -> Dict:
    if not tx_id:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Transaction ID required'}),
            'isBase64Encoded': False
        }
    
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    cursor.execute("""
        SELECT ppt.id, ppt.external_transaction_id, ppt.status, ppt.amount, 
               ppt.currency, ppt.confirmations, ppt.required_confirmations,
               ppt.payment_url, ppt.payment_address, pp.name as provider_name
        FROM payment_provider_transactions ppt
        JOIN payment_providers pp ON ppt.provider_id = pp.id
        WHERE ppt.id = %s
    """, (tx_id,))
    
    row = cursor.fetchone()
    
    if not row:
        return {
            'statusCode': 404,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Transaction not found'}),
            'isBase64Encoded': False
        }
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps(dict(row), default=str),
        'isBase64Encoded': False
    }