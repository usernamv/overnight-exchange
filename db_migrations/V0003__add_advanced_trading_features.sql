-- Add referral system tables
CREATE TABLE IF NOT EXISTS referral_codes (
    id SERIAL PRIMARY KEY,
    client_id INTEGER REFERENCES clients(id),
    code VARCHAR(20) UNIQUE NOT NULL,
    discount_percent DECIMAL(5, 2) DEFAULT 0,
    commission_percent DECIMAL(5, 2) DEFAULT 10,
    total_referrals INTEGER DEFAULT 0,
    total_earnings_usd DECIMAL(20, 2) DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS referral_usage (
    id SERIAL PRIMARY KEY,
    referral_code_id INTEGER REFERENCES referral_codes(id),
    referred_client_id INTEGER REFERENCES clients(id),
    exchange_id INTEGER REFERENCES exchanges(id),
    commission_usd DECIMAL(20, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add limit orders table
CREATE TABLE IF NOT EXISTS limit_orders (
    id SERIAL PRIMARY KEY,
    client_id INTEGER REFERENCES clients(id),
    from_currency VARCHAR(20) NOT NULL,
    to_currency VARCHAR(20) NOT NULL,
    from_amount DECIMAL(20, 8) NOT NULL,
    target_rate DECIMAL(20, 8) NOT NULL,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'filled', 'cancelled', 'expired')),
    expiry_date TIMESTAMP,
    filled_exchange_id INTEGER REFERENCES exchanges(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    filled_at TIMESTAMP
);

-- Add blockchain transactions tracking table
CREATE TABLE IF NOT EXISTS blockchain_transactions (
    id SERIAL PRIMARY KEY,
    exchange_id INTEGER REFERENCES exchanges(id),
    blockchain VARCHAR(50) NOT NULL,
    tx_hash VARCHAR(255) UNIQUE,
    from_address VARCHAR(255),
    to_address VARCHAR(255),
    amount DECIMAL(20, 8),
    currency VARCHAR(20),
    confirmations INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirming', 'confirmed', 'failed')),
    block_number BIGINT,
    gas_used DECIMAL(20, 8),
    gas_price_gwei DECIMAL(20, 8),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    confirmed_at TIMESTAMP
);

-- Add price alerts table
CREATE TABLE IF NOT EXISTS price_alerts (
    id SERIAL PRIMARY KEY,
    client_id INTEGER REFERENCES clients(id),
    currency VARCHAR(20) NOT NULL,
    target_price DECIMAL(20, 8) NOT NULL,
    condition VARCHAR(10) CHECK (condition IN ('above', 'below')),
    is_triggered BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    triggered_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add trading analytics table
CREATE TABLE IF NOT EXISTS trading_analytics (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    currency_pair VARCHAR(50) NOT NULL,
    volume_24h DECIMAL(20, 2),
    high_24h DECIMAL(20, 8),
    low_24h DECIMAL(20, 8),
    avg_price DECIMAL(20, 8),
    trades_count INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(date, currency_pair)
);

-- Add API keys for users
CREATE TABLE IF NOT EXISTS api_keys (
    id SERIAL PRIMARY KEY,
    client_id INTEGER REFERENCES clients(id),
    api_key VARCHAR(64) UNIQUE NOT NULL,
    api_secret VARCHAR(128) NOT NULL,
    permissions JSONB DEFAULT '{"read": true, "trade": false, "withdraw": false}',
    is_active BOOLEAN DEFAULT true,
    last_used_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add columns to exchanges table for blockchain tracking
ALTER TABLE exchanges ADD COLUMN IF NOT EXISTS deposit_tx_hash VARCHAR(255);
ALTER TABLE exchanges ADD COLUMN IF NOT EXISTS deposit_confirmed_at TIMESTAMP;
ALTER TABLE exchanges ADD COLUMN IF NOT EXISTS withdrawal_tx_hash VARCHAR(255);
ALTER TABLE exchanges ADD COLUMN IF NOT EXISTS withdrawal_confirmed_at TIMESTAMP;
ALTER TABLE exchanges ADD COLUMN IF NOT EXISTS blockchain_from VARCHAR(50);
ALTER TABLE exchanges ADD COLUMN IF NOT EXISTS blockchain_to VARCHAR(50);
ALTER TABLE exchanges ADD COLUMN IF NOT EXISTS referral_code_id INTEGER REFERENCES referral_codes(id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_referral_codes_code ON referral_codes(code);
CREATE INDEX IF NOT EXISTS idx_referral_usage_referral_code_id ON referral_usage(referral_code_id);
CREATE INDEX IF NOT EXISTS idx_limit_orders_client_id ON limit_orders(client_id);
CREATE INDEX IF NOT EXISTS idx_limit_orders_status ON limit_orders(status);
CREATE INDEX IF NOT EXISTS idx_blockchain_transactions_tx_hash ON blockchain_transactions(tx_hash);
CREATE INDEX IF NOT EXISTS idx_blockchain_transactions_exchange_id ON blockchain_transactions(exchange_id);
CREATE INDEX IF NOT EXISTS idx_price_alerts_client_id ON price_alerts(client_id, is_active);
CREATE INDEX IF NOT EXISTS idx_trading_analytics_date ON trading_analytics(date DESC);
CREATE INDEX IF NOT EXISTS idx_api_keys_client_id ON api_keys(client_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_api_key ON api_keys(api_key);