-- Payment providers configuration
CREATE TABLE IF NOT EXISTS payment_providers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    type VARCHAR(50) NOT NULL, -- 'coinbase_commerce', 'nowpayments', 'coinpayments', 'binance_pay', 'custom'
    api_key_placeholder VARCHAR(255),
    api_secret_placeholder VARCHAR(255),
    webhook_secret_placeholder VARCHAR(255),
    is_active BOOLEAN DEFAULT false,
    supported_currencies TEXT[], -- Array of supported crypto currencies
    config JSONB DEFAULT '{}', -- Additional provider-specific config
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Payment provider transactions
CREATE TABLE IF NOT EXISTS payment_provider_transactions (
    id SERIAL PRIMARY KEY,
    provider_id INTEGER REFERENCES payment_providers(id),
    exchange_id INTEGER REFERENCES exchanges(id),
    external_transaction_id VARCHAR(255),
    payment_url TEXT,
    amount DECIMAL(20, 8) NOT NULL,
    currency VARCHAR(10) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending', -- pending, processing, completed, failed, expired
    payment_address TEXT,
    confirmations INTEGER DEFAULT 0,
    required_confirmations INTEGER DEFAULT 3,
    metadata JSONB DEFAULT '{}',
    webhook_data JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

-- Commission settings (flexible per currency pair)
CREATE TABLE IF NOT EXISTS commission_settings (
    id SERIAL PRIMARY KEY,
    from_currency VARCHAR(10) NOT NULL,
    to_currency VARCHAR(10) NOT NULL,
    commission_percent DECIMAL(5, 2) DEFAULT 2.00,
    min_commission DECIMAL(20, 8) DEFAULT 0,
    max_commission DECIMAL(20, 8),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(from_currency, to_currency)
);

-- Site content management (texts, links, etc)
CREATE TABLE IF NOT EXISTS site_content (
    id SERIAL PRIMARY KEY,
    key VARCHAR(100) NOT NULL UNIQUE, -- 'hero_title', 'hero_subtitle', 'support_email', etc
    value TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'text', -- 'text', 'html', 'url', 'email', 'phone'
    category VARCHAR(50) DEFAULT 'general', -- 'hero', 'footer', 'contact', 'faq'
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Rate sources management (extended from existing)
CREATE TABLE IF NOT EXISTS rate_source_settings (
    id SERIAL PRIMARY KEY,
    source_name VARCHAR(100) NOT NULL,
    api_url TEXT,
    api_key_placeholder VARCHAR(255),
    priority INTEGER DEFAULT 1, -- Higher priority sources checked first
    is_active BOOLEAN DEFAULT true,
    rate_multiplier DECIMAL(10, 6) DEFAULT 1.000000, -- For markup/adjustment
    cache_duration_seconds INTEGER DEFAULT 300,
    supported_pairs TEXT[],
    config JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- System-wide settings
CREATE TABLE IF NOT EXISTS system_settings (
    id SERIAL PRIMARY KEY,
    key VARCHAR(100) NOT NULL UNIQUE,
    value TEXT NOT NULL,
    value_type VARCHAR(50) DEFAULT 'string', -- 'string', 'number', 'boolean', 'json'
    category VARCHAR(50) DEFAULT 'general',
    description TEXT,
    is_editable BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default payment providers
INSERT INTO payment_providers (name, type, supported_currencies, config) VALUES
('Coinbase Commerce', 'coinbase_commerce', ARRAY['BTC', 'ETH', 'USDT', 'USDC', 'DAI', 'LTC'], '{"api_version": "2018-03-22"}'),
('NOWPayments', 'nowpayments', ARRAY['BTC', 'ETH', 'USDT', 'BNB', 'SOL', 'XRP', 'ADA', 'DOT'], '{"sandbox_mode": false}'),
('CoinPayments', 'coinpayments', ARRAY['BTC', 'ETH', 'LTC', 'DOGE', 'BCH', 'XRP'], '{"ipn_version": "1.0"}'),
('Binance Pay', 'binance_pay', ARRAY['BTC', 'ETH', 'USDT', 'BNB', 'BUSD'], '{"merchant_type": "standard"}');

-- Insert default commission settings
INSERT INTO commission_settings (from_currency, to_currency, commission_percent, min_commission) VALUES
('BTC', 'USDT', 1.50, 0.00001),
('ETH', 'USDT', 1.50, 0.0001),
('USDT', 'BTC', 2.00, 1.00),
('USDT', 'ETH', 2.00, 1.00),
('BTC', 'ETH', 1.00, 0.00001),
('ETH', 'BTC', 1.00, 0.0001);

-- Insert default site content
INSERT INTO site_content (key, value, type, category, description) VALUES
('hero_title', 'Обменник криптовалюты', 'text', 'hero', 'Главный заголовок на главной странице'),
('hero_subtitle', 'Быстрый и безопасный обмен цифровых активов', 'text', 'hero', 'Подзаголовок на главной странице'),
('support_email', 'support@overnight-exchange.com', 'email', 'contact', 'Email службы поддержки'),
('support_telegram', '@overnight_support', 'text', 'contact', 'Telegram поддержки'),
('min_exchange_amount', '10', 'number', 'limits', 'Минимальная сумма обмена в USDT'),
('max_exchange_amount_unverified', '1000', 'number', 'limits', 'Максимальная сумма для неверифицированных пользователей'),
('footer_copyright', '© 2024 Overnight Exchange. Все права защищены.', 'text', 'footer', 'Текст копирайта в футере'),
('terms_url', '/terms', 'url', 'footer', 'Ссылка на условия использования'),
('privacy_url', '/privacy', 'url', 'footer', 'Ссылка на политику конфиденциальности');

-- Insert default rate sources
INSERT INTO rate_source_settings (source_name, api_url, priority, supported_pairs) VALUES
('Binance', 'https://api.binance.com/api/v3/ticker/price', 1, ARRAY['BTCUSDT', 'ETHUSDT', 'BNBUSDT']),
('CoinGecko', 'https://api.coingecko.com/api/v3/simple/price', 2, ARRAY['BTC', 'ETH', 'BNB', 'SOL']),
('Kraken', 'https://api.kraken.com/0/public/Ticker', 3, ARRAY['XBTUSD', 'ETHUSD']);

-- Insert default system settings
INSERT INTO system_settings (key, value, value_type, category, description) VALUES
('maintenance_mode', 'false', 'boolean', 'system', 'Режим технического обслуживания'),
('auto_kyc_enabled', 'true', 'boolean', 'kyc', 'Автоматическая проверка KYC'),
('max_daily_exchanges', '50', 'number', 'limits', 'Максимальное количество обменов в день на пользователя'),
('referral_commission_percent', '10', 'number', 'referral', 'Процент реферальной комиссии'),
('blockchain_confirmation_check_interval', '60', 'number', 'blockchain', 'Интервал проверки подтверждений в секундах'),
('session_timeout_minutes', '30', 'number', 'security', 'Таймаут сессии в минутах');

-- Create indexes for performance
CREATE INDEX idx_payment_provider_transactions_status ON payment_provider_transactions(status);
CREATE INDEX idx_payment_provider_transactions_exchange ON payment_provider_transactions(exchange_id);
CREATE INDEX idx_commission_settings_currencies ON commission_settings(from_currency, to_currency);
CREATE INDEX idx_site_content_category ON site_content(category);
CREATE INDEX idx_rate_source_settings_active ON rate_source_settings(is_active, priority);