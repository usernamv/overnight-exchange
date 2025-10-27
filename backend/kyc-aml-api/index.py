"""
Business: KYC/AML verification API - handle client verifications, risk checks, wallet validation
Args: event with httpMethod, body, queryStringParameters; context with request_id
Returns: HTTP response with verification status, risk assessment, or operation results
"""

import json
import os
from datetime import datetime, timedelta
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
                'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
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
            
            if action == 'check_limits':
                return check_exchange_limits(conn, params)
            elif action == 'get_kyc_status':
                return get_kyc_status(conn, params.get('client_id'))
            elif action == 'get_aml_status':
                return get_aml_status(conn, params.get('client_id'))
            elif action == 'verify_wallet':
                return verify_wallet_ownership(conn, params)
            
        elif method == 'POST':
            body = json.loads(event.get('body', '{}'))
            action = body.get('action')
            
            if action == 'submit_kyc':
                return submit_kyc_documents(conn, body)
            elif action == 'perform_aml_check':
                return perform_aml_check(conn, body)
            elif action == 'verify_exchange':
                return verify_exchange_compliance(conn, body)
            elif action == 'request_wallet_verification':
                return request_wallet_verification(conn, body)
            
        elif method == 'PUT':
            body = json.loads(event.get('body', '{}'))
            action = body.get('action')
            
            if action == 'approve_kyc':
                return approve_kyc(conn, body)
            elif action == 'reject_kyc':
                return reject_kyc(conn, body)
        
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Invalid action'}),
            'isBase64Encoded': False
        }
        
    finally:
        conn.close()

def check_exchange_limits(conn, params: Dict) -> Dict:
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    client_id = params.get('client_id')
    amount_usd = float(params.get('amount_usd', 0))
    
    cursor.execute("SELECT verification_level FROM clients WHERE id = %s", (client_id,))
    client = cursor.fetchone()
    
    if not client:
        return {
            'statusCode': 404,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Client not found'}),
            'isBase64Encoded': False
        }
    
    verification_level = client['verification_level'] or 'none'
    
    cursor.execute("""
        SELECT * FROM exchange_limits 
        WHERE verification_level = %s
    """, (verification_level,))
    limits = cursor.fetchone()
    
    cursor.execute("""
        SELECT COALESCE(SUM(from_amount), 0) as daily_volume
        FROM exchanges
        WHERE client_id = %s 
        AND created_at > NOW() - INTERVAL '1 day'
        AND status IN ('completed', 'processing', 'pending')
    """, (client_id,))
    usage = cursor.fetchone()
    
    daily_remaining = float(limits['daily_limit_usd']) - float(usage['daily_volume'])
    can_proceed = amount_usd <= daily_remaining and amount_usd <= float(limits['single_transaction_limit_usd'])
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({
            'can_proceed': can_proceed,
            'verification_level': verification_level,
            'limits': dict(limits),
            'daily_used': float(usage['daily_volume']),
            'daily_remaining': daily_remaining,
            'requires_kyc': limits['requires_kyc'],
            'requires_aml': limits['requires_aml']
        }, default=str),
        'isBase64Encoded': False
    }

def get_kyc_status(conn, client_id: str) -> Dict:
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    cursor.execute("""
        SELECT * FROM kyc_verifications 
        WHERE client_id = %s 
        ORDER BY created_at DESC 
        LIMIT 1
    """, (client_id,))
    kyc = cursor.fetchone()
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'kyc': dict(kyc) if kyc else None}, default=str),
        'isBase64Encoded': False
    }

def get_aml_status(conn, client_id: str) -> Dict:
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    cursor.execute("""
        SELECT * FROM aml_checks 
        WHERE client_id = %s 
        ORDER BY created_at DESC 
        LIMIT 5
    """, (client_id,))
    checks = cursor.fetchall()
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'aml_checks': [dict(c) for c in checks]}, default=str),
        'isBase64Encoded': False
    }

def submit_kyc_documents(conn, data: Dict) -> Dict:
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    cursor.execute("""
        INSERT INTO kyc_verifications 
        (client_id, verification_level, status, document_type, document_number, 
         document_front_url, document_back_url, selfie_url, address_proof_url)
        VALUES (%s, %s, 'reviewing', %s, %s, %s, %s, %s, %s)
        RETURNING id
    """, (
        data['client_id'],
        data.get('verification_level', 'basic'),
        data.get('document_type'),
        data.get('document_number'),
        data.get('document_front_url'),
        data.get('document_back_url'),
        data.get('selfie_url'),
        data.get('address_proof_url')
    ))
    
    result = cursor.fetchone()
    
    cursor.execute("""
        UPDATE clients SET kyc_status = 'reviewing' WHERE id = %s
    """, (data['client_id'],))
    
    conn.commit()
    
    return {
        'statusCode': 201,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({
            'success': True,
            'kyc_id': result['id'],
            'message': 'KYC documents submitted for review'
        }),
        'isBase64Encoded': False
    }

def perform_aml_check(conn, data: Dict) -> Dict:
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    client_id = data['client_id']
    exchange_id = data.get('exchange_id')
    
    cursor.execute("SELECT * FROM clients WHERE id = %s", (client_id,))
    client = cursor.fetchone()
    
    risk_score = 0.0
    sanctions_hit = False
    pep_hit = False
    adverse_media_hit = False
    
    if client['country_code'] in ['IR', 'KP', 'SY']:
        risk_score += 80.0
        sanctions_hit = True
    
    cursor.execute("""
        SELECT COUNT(*) as failed_count FROM exchanges 
        WHERE client_id = %s AND status = 'failed'
    """, (client_id,))
    failed = cursor.fetchone()
    risk_score += min(failed['failed_count'] * 5, 20)
    
    if risk_score < 30:
        risk_level = 'low'
    elif risk_score < 60:
        risk_level = 'medium'
    elif risk_score < 80:
        risk_level = 'high'
    else:
        risk_level = 'critical'
    
    cursor.execute("""
        INSERT INTO aml_checks 
        (client_id, exchange_id, check_type, risk_level, risk_score, 
         sanctions_hit, pep_hit, adverse_media_hit, check_result, checked_by)
        VALUES (%s, %s, 'automatic', %s, %s, %s, %s, %s, %s, 'system')
        RETURNING id
    """, (
        client_id,
        exchange_id,
        risk_level,
        risk_score,
        sanctions_hit,
        pep_hit,
        adverse_media_hit,
        json.dumps({'timestamp': datetime.now().isoformat()})
    ))
    
    result = cursor.fetchone()
    
    cursor.execute("""
        UPDATE clients SET aml_status = %s, risk_level = %s WHERE id = %s
    """, ('checked', risk_level, client_id))
    
    conn.commit()
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({
            'success': True,
            'aml_check_id': result['id'],
            'risk_level': risk_level,
            'risk_score': float(risk_score),
            'passed': risk_level in ['low', 'medium']
        }, default=str),
        'isBase64Encoded': False
    }

def verify_exchange_compliance(conn, data: Dict) -> Dict:
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    exchange_id = data['exchange_id']
    client_id = data['client_id']
    amount_usd = data['amount_usd']
    
    cursor.execute("SELECT * FROM clients WHERE id = %s", (client_id,))
    client = cursor.fetchone()
    
    verification_level = client['verification_level'] or 'none'
    
    cursor.execute("""
        SELECT * FROM exchange_limits WHERE verification_level = %s
    """, (verification_level,))
    limits = cursor.fetchone()
    
    issues = []
    can_proceed = True
    
    if amount_usd > float(limits['single_transaction_limit_usd']):
        issues.append(f'Amount exceeds single transaction limit of ${limits["single_transaction_limit_usd"]}')
        can_proceed = False
    
    if limits['requires_kyc'] and client['kyc_status'] not in ['approved', 'verified']:
        issues.append('KYC verification required')
        can_proceed = False
    
    if limits['requires_aml']:
        cursor.execute("""
            SELECT * FROM aml_checks 
            WHERE client_id = %s 
            ORDER BY created_at DESC 
            LIMIT 1
        """, (client_id,))
        aml_check = cursor.fetchone()
        
        if not aml_check or aml_check['risk_level'] in ['high', 'critical']:
            issues.append('AML check required or high risk detected')
            can_proceed = False
    
    cursor.execute("""
        INSERT INTO transaction_logs (exchange_id, action, notes, performed_by)
        VALUES (%s, 'compliance_check', %s, 'system')
    """, (exchange_id, json.dumps(issues)))
    
    conn.commit()
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({
            'can_proceed': can_proceed,
            'issues': issues,
            'verification_level': verification_level,
            'requires_kyc': limits['requires_kyc'],
            'requires_aml': limits['requires_aml']
        }),
        'isBase64Encoded': False
    }

def approve_kyc(conn, data: Dict) -> Dict:
    cursor = conn.cursor()
    
    kyc_id = data['kyc_id']
    verification_level = data.get('verification_level', 'basic')
    
    cursor.execute("""
        UPDATE kyc_verifications 
        SET status = 'approved', 
            verification_level = %s,
            verified_at = CURRENT_TIMESTAMP,
            expires_at = CURRENT_TIMESTAMP + INTERVAL '1 year'
        WHERE id = %s
        RETURNING client_id
    """, (verification_level, kyc_id))
    
    result = cursor.fetchone()
    client_id = result[0]
    
    cursor.execute("""
        UPDATE clients 
        SET kyc_status = 'approved', verification_level = %s
        WHERE id = %s
    """, (verification_level, client_id))
    
    conn.commit()
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'success': True, 'message': 'KYC approved'}),
        'isBase64Encoded': False
    }

def reject_kyc(conn, data: Dict) -> Dict:
    cursor = conn.cursor()
    
    kyc_id = data['kyc_id']
    reason = data.get('reason', 'Documents verification failed')
    
    cursor.execute("""
        UPDATE kyc_verifications 
        SET status = 'rejected', rejection_reason = %s
        WHERE id = %s
        RETURNING client_id
    """, (reason, kyc_id))
    
    result = cursor.fetchone()
    client_id = result[0]
    
    cursor.execute("""
        UPDATE clients SET kyc_status = 'rejected' WHERE id = %s
    """, (client_id,))
    
    conn.commit()
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'success': True, 'message': 'KYC rejected', 'reason': reason}),
        'isBase64Encoded': False
    }

def request_wallet_verification(conn, data: Dict) -> Dict:
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    import random
    import string
    verification_code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))
    
    cursor.execute("""
        INSERT INTO wallet_verifications 
        (client_id, wallet_address, currency, verification_code, verification_method)
        VALUES (%s, %s, %s, %s, %s)
        ON CONFLICT (client_id, wallet_address, currency) 
        DO UPDATE SET verification_code = EXCLUDED.verification_code
        RETURNING id
    """, (
        data['client_id'],
        data['wallet_address'],
        data['currency'],
        verification_code,
        data.get('verification_method', 'signature')
    ))
    
    result = cursor.fetchone()
    conn.commit()
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({
            'success': True,
            'verification_id': result['id'],
            'verification_code': verification_code,
            'message': f'Send {verification_code} from your wallet to verify ownership'
        }),
        'isBase64Encoded': False
    }

def verify_wallet_ownership(conn, params: Dict) -> Dict:
    cursor = conn.cursor()
    
    verification_id = params.get('verification_id')
    provided_code = params.get('code')
    
    cursor.execute("""
        SELECT verification_code FROM wallet_verifications WHERE id = %s
    """, (verification_id,))
    
    result = cursor.fetchone()
    
    if result and result[0] == provided_code:
        cursor.execute("""
            UPDATE wallet_verifications 
            SET is_verified = true, verified_at = CURRENT_TIMESTAMP
            WHERE id = %s
        """, (verification_id,))
        conn.commit()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'success': True, 'verified': True}),
            'isBase64Encoded': False
        }
    
    return {
        'statusCode': 400,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'success': False, 'verified': False, 'error': 'Invalid verification code'}),
        'isBase64Encoded': False
    }
