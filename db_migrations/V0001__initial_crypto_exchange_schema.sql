-- Create clients table
CREATE TABLE IF NOT EXISTS clients (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    full_name VARCHAR(255),
    telegram_username VARCHAR(100),
    wallet_addresses JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true
);

-- Create currencies table
CREATE TABLE IF NOT EXISTS currencies (
    id SERIAL PRIMARY KEY,
    symbol VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('crypto', 'fiat')),
    icon_emoji VARCHAR(10),
    is_active BOOLEAN DEFAULT true,
    decimals INTEGER DEFAULT 8,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create exchange_rates table
CREATE TABLE IF NOT EXISTS exchange_rates (
    id SERIAL PRIMARY KEY,
    from_currency VARCHAR(20) NOT NULL,
    to_currency VARCHAR(20) NOT NULL,
    rate DECIMAL(20, 8) NOT NULL,
    source VARCHAR(50) DEFAULT 'cryptocompare',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(from_currency, to_currency, source)
);

-- Create exchanges table
CREATE TABLE IF NOT EXISTS exchanges (
    id SERIAL PRIMARY KEY,
    client_id INTEGER REFERENCES clients(id),
    from_currency VARCHAR(20) NOT NULL,
    to_currency VARCHAR(20) NOT NULL,
    from_amount DECIMAL(20, 8) NOT NULL,
    to_amount DECIMAL(20, 8) NOT NULL,
    exchange_rate DECIMAL(20, 8) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')),
    from_wallet VARCHAR(255),
    to_wallet VARCHAR(255),
    transaction_hash VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    notes TEXT
);

-- Create rate_sources table
CREATE TABLE IF NOT EXISTS rate_sources (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    api_url VARCHAR(500) NOT NULL,
    api_key_required BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    priority INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create sponsors table
CREATE TABLE IF NOT EXISTS sponsors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    logo_url VARCHAR(500),
    website_url VARCHAR(500),
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create admin_settings table
CREATE TABLE IF NOT EXISTS admin_settings (
    id SERIAL PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    description TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default currencies
INSERT INTO currencies (symbol, name, type, icon_emoji, decimals) VALUES
('BTC', 'Bitcoin', 'crypto', '₿', 8),
('ETH', 'Ethereum', 'crypto', 'Ξ', 8),
('USDT', 'Tether', 'crypto', '₮', 6),
('USDC', 'USD Coin', 'crypto', '$', 6),
('BNB', 'Binance Coin', 'crypto', '🔸', 8),
('USD', 'US Dollar', 'fiat', '$', 2),
('EUR', 'Euro', 'fiat', '€', 2),
('RUB', 'Russian Ruble', 'fiat', '₽', 2)
ON CONFLICT (symbol) DO NOTHING;

-- Insert default rate source
INSERT INTO rate_sources (name, api_url, api_key_required, is_active, priority) VALUES
('CryptoCompare', 'https://min-api.cryptocompare.com/data/price', true, true, 1)
ON CONFLICT (name) DO NOTHING;

-- Insert default admin settings
INSERT INTO admin_settings (setting_key, setting_value, description) VALUES
('default_rate_source', 'cryptocompare', 'Default exchange rate provider'),
('commission_percent', '0.5', 'Exchange commission percentage'),
('min_exchange_amount', '10', 'Minimum exchange amount in USD equivalent')
ON CONFLICT (setting_key) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_exchanges_client_id ON exchanges(client_id);
CREATE INDEX IF NOT EXISTS idx_exchanges_status ON exchanges(status);
CREATE INDEX IF NOT EXISTS idx_exchanges_created_at ON exchanges(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_exchange_rates_currencies ON exchange_rates(from_currency, to_currency);
CREATE INDEX IF NOT EXISTS idx_clients_email ON clients(email);