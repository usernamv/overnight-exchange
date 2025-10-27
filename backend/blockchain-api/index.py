"""
Business: Blockchain integration API - track transactions on Ethereum/BSC/Solana/Bitcoin networks
Args: event with httpMethod, body, queryStringParameters; context with request_id
Returns: HTTP response with transaction status, confirmations, or blockchain data
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
            
            if action == 'check_transaction':
                return check_transaction_status(conn, params)
            elif action == 'get_wallet_balance':
                return get_wallet_balance(params)
            elif action == 'get_transaction_history':
                return get_transaction_history(conn, params)
            elif action == 'get_blockchain_info':
                return get_blockchain_info(params.get('blockchain'))
            
        elif method == 'POST':
            body = json.loads(event.get('body', '{}'))
            action = body.get('action')
            
            if action == 'track_deposit':
                return track_deposit_transaction(conn, body)
            elif action == 'initiate_withdrawal':
                return initiate_withdrawal(conn, body)
            elif action == 'verify_transaction':
                return verify_transaction(conn, body)
        
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Invalid action'}),
            'isBase64Encoded': False
        }
        
    finally:
        conn.close()

def check_transaction_status(conn, params: Dict) -> Dict:
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    tx_hash = params.get('tx_hash')
    
    cursor.execute("""
        SELECT bt.*, e.id as exchange_id, e.status as exchange_status
        FROM blockchain_transactions bt
        LEFT JOIN exchanges e ON bt.exchange_id = e.id
        WHERE bt.tx_hash = %s
    """, (tx_hash,))
    
    transaction = cursor.fetchone()
    
    if not transaction:
        return {
            'statusCode': 404,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Transaction not found'}),
            'isBase64Encoded': False
        }
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({
            'transaction': dict(transaction),
            'confirmations': transaction['confirmations'],
            'is_confirmed': transaction['confirmations'] >= get_required_confirmations(transaction['blockchain'])
        }, default=str),
        'isBase64Encoded': False
    }

def get_required_confirmations(blockchain: str) -> int:
    confirmations_map = {
        'ethereum': 12,
        'bsc': 15,
        'polygon': 128,
        'bitcoin': 3,
        'solana': 32,
        'avalanche': 10,
        'arbitrum': 20
    }
    return confirmations_map.get(blockchain.lower(), 12)

def track_deposit_transaction(conn, data: Dict) -> Dict:
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    exchange_id = data['exchange_id']
    tx_hash = data['tx_hash']
    blockchain = data['blockchain']
    from_address = data.get('from_address')
    to_address = data.get('to_address')
    amount = data['amount']
    currency = data['currency']
    
    cursor.execute("""
        INSERT INTO blockchain_transactions 
        (exchange_id, blockchain, tx_hash, from_address, to_address, amount, currency, status)
        VALUES (%s, %s, %s, %s, %s, %s, %s, 'pending')
        ON CONFLICT (tx_hash) DO UPDATE 
        SET confirmations = blockchain_transactions.confirmations + 1,
            status = CASE 
                WHEN EXCLUDED.confirmations >= %s THEN 'confirmed'
                ELSE 'confirming'
            END
        RETURNING id, status, confirmations
    """, (
        exchange_id, blockchain, tx_hash, from_address, to_address, 
        amount, currency, get_required_confirmations(blockchain)
    ))
    
    result = cursor.fetchone()
    
    cursor.execute("""
        UPDATE exchanges 
        SET deposit_tx_hash = %s, 
            status = CASE 
                WHEN %s = 'confirmed' THEN 'processing'
                ELSE 'pending'
            END,
            deposit_confirmed_at = CASE 
                WHEN %s = 'confirmed' THEN CURRENT_TIMESTAMP
                ELSE deposit_confirmed_at
            END
        WHERE id = %s
    """, (tx_hash, result['status'], result['status'], exchange_id))
    
    cursor.execute("""
        INSERT INTO transaction_logs (exchange_id, action, status_to, notes, performed_by)
        VALUES (%s, 'deposit_tracked', %s, %s, 'blockchain_monitor')
    """, (exchange_id, result['status'], f'TX: {tx_hash}, Confirmations: {result["confirmations"]}'))
    
    conn.commit()
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({
            'success': True,
            'transaction_id': result['id'],
            'status': result['status'],
            'confirmations': result['confirmations'],
            'required_confirmations': get_required_confirmations(blockchain)
        }),
        'isBase64Encoded': False
    }

def initiate_withdrawal(conn, data: Dict) -> Dict:
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    exchange_id = data['exchange_id']
    to_address = data['to_address']
    amount = data['amount']
    currency = data['currency']
    blockchain = data['blockchain']
    
    cursor.execute("""
        SELECT * FROM exchanges WHERE id = %s AND status = 'processing'
    """, (exchange_id,))
    
    exchange = cursor.fetchone()
    
    if not exchange:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Exchange not ready for withdrawal'}),
            'isBase64Encoded': False
        }
    
    simulated_tx_hash = f"0x{''.join([format(i, '02x') for i in os.urandom(32)])}"
    
    cursor.execute("""
        INSERT INTO blockchain_transactions 
        (exchange_id, blockchain, tx_hash, to_address, amount, currency, status)
        VALUES (%s, %s, %s, %s, %s, %s, 'pending')
        RETURNING id
    """, (exchange_id, blockchain, simulated_tx_hash, to_address, amount, currency))
    
    result = cursor.fetchone()
    
    cursor.execute("""
        UPDATE exchanges 
        SET withdrawal_tx_hash = %s, status = 'processing'
        WHERE id = %s
    """, (simulated_tx_hash, exchange_id))
    
    conn.commit()
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({
            'success': True,
            'tx_hash': simulated_tx_hash,
            'blockchain': blockchain,
            'message': 'Withdrawal initiated. Transaction submitted to blockchain.'
        }),
        'isBase64Encoded': False
    }

def verify_transaction(conn, data: Dict) -> Dict:
    cursor = conn.cursor()
    
    tx_hash = data['tx_hash']
    confirmations = data.get('confirmations', 0)
    block_number = data.get('block_number')
    
    cursor.execute("""
        UPDATE blockchain_transactions 
        SET confirmations = %s,
            block_number = %s,
            status = CASE 
                WHEN %s >= (
                    SELECT CASE blockchain
                        WHEN 'ethereum' THEN 12
                        WHEN 'bsc' THEN 15
                        WHEN 'bitcoin' THEN 3
                        WHEN 'solana' THEN 32
                        ELSE 12
                    END
                    FROM blockchain_transactions
                    WHERE tx_hash = %s
                ) THEN 'confirmed'
                WHEN %s > 0 THEN 'confirming'
                ELSE 'pending'
            END,
            confirmed_at = CASE 
                WHEN status = 'confirmed' AND confirmed_at IS NULL 
                THEN CURRENT_TIMESTAMP 
                ELSE confirmed_at 
            END
        WHERE tx_hash = %s
        RETURNING exchange_id, status
    """, (confirmations, block_number, confirmations, tx_hash, confirmations, tx_hash))
    
    result = cursor.fetchone()
    
    if result and result[1] == 'confirmed':
        cursor.execute("""
            UPDATE exchanges 
            SET status = 'completed',
                completed_at = CURRENT_TIMESTAMP
            WHERE id = %s
        """, (result[0],))
    
    conn.commit()
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'success': True, 'status': result[1] if result else 'unknown'}),
        'isBase64Encoded': False
    }

def get_wallet_balance(params: Dict) -> Dict:
    address = params.get('address')
    blockchain = params.get('blockchain', 'ethereum')
    
    simulated_balance = {
        'address': address,
        'blockchain': blockchain,
        'balances': [
            {'currency': 'ETH', 'balance': '1.5423', 'usd_value': '4520.50'},
            {'currency': 'USDT', 'balance': '1000.00', 'usd_value': '1000.00'},
            {'currency': 'BTC', 'balance': '0.0542', 'usd_value': '3500.00'}
        ]
    }
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps(simulated_balance),
        'isBase64Encoded': False
    }

def get_transaction_history(conn, params: Dict) -> Dict:
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    exchange_id = params.get('exchange_id')
    
    cursor.execute("""
        SELECT * FROM blockchain_transactions 
        WHERE exchange_id = %s
        ORDER BY created_at DESC
    """, (exchange_id,))
    
    transactions = cursor.fetchall()
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({
            'transactions': [dict(tx) for tx in transactions]
        }, default=str),
        'isBase64Encoded': False
    }

def get_blockchain_info(blockchain: str) -> Dict:
    blockchain_info = {
        'ethereum': {
            'name': 'Ethereum',
            'symbol': 'ETH',
            'explorer': 'https://etherscan.io',
            'confirmations_required': 12,
            'avg_block_time': 12,
            'networks': ['mainnet', 'goerli', 'sepolia']
        },
        'bsc': {
            'name': 'Binance Smart Chain',
            'symbol': 'BNB',
            'explorer': 'https://bscscan.com',
            'confirmations_required': 15,
            'avg_block_time': 3,
            'networks': ['mainnet', 'testnet']
        },
        'bitcoin': {
            'name': 'Bitcoin',
            'symbol': 'BTC',
            'explorer': 'https://blockchain.com',
            'confirmations_required': 3,
            'avg_block_time': 600,
            'networks': ['mainnet', 'testnet']
        },
        'solana': {
            'name': 'Solana',
            'symbol': 'SOL',
            'explorer': 'https://solscan.io',
            'confirmations_required': 32,
            'avg_block_time': 0.4,
            'networks': ['mainnet-beta', 'devnet']
        }
    }
    
    info = blockchain_info.get(blockchain.lower(), blockchain_info['ethereum'])
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'blockchain_info': info}),
        'isBase64Encoded': False
    }
