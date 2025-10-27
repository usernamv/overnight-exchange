-- Добавляем поле для номера заявки
ALTER TABLE t_p7012082_overnight_exchange_d.exchanges ADD COLUMN IF NOT EXISTS order_number VARCHAR(50);

-- Создаем уникальный индекс для order_number
CREATE UNIQUE INDEX IF NOT EXISTS idx_exchanges_order_number_unique ON t_p7012082_overnight_exchange_d.exchanges(order_number) WHERE order_number IS NOT NULL;

-- Добавляем индексы для быстрого поиска
CREATE INDEX IF NOT EXISTS idx_exchanges_client_id ON t_p7012082_overnight_exchange_d.exchanges(client_id);
CREATE INDEX IF NOT EXISTS idx_exchanges_status ON t_p7012082_overnight_exchange_d.exchanges(status);
CREATE INDEX IF NOT EXISTS idx_exchanges_created_at ON t_p7012082_overnight_exchange_d.exchanges(created_at DESC);

-- Обновляем существующие записи с уникальными номерами
UPDATE t_p7012082_overnight_exchange_d.exchanges 
SET order_number = 'ORD-' || LPAD(id::text, 8, '0')
WHERE order_number IS NULL;

-- Создаем таблицу партнеров
CREATE TABLE IF NOT EXISTS t_p7012082_overnight_exchange_d.partners (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    logo_url TEXT,
    website_url TEXT,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создаем индекс для активных партнеров
CREATE INDEX IF NOT EXISTS idx_partners_active ON t_p7012082_overnight_exchange_d.partners(is_active, display_order);

-- Добавляем больше криптовалют
INSERT INTO t_p7012082_overnight_exchange_d.currencies (symbol, name, type, icon_emoji, is_active, decimals)
VALUES 
    ('LTC', 'Litecoin', 'crypto', '🪙', true, 8),
    ('XRP', 'Ripple', 'crypto', '💧', true, 6),
    ('TRX', 'Tron', 'crypto', '⚡', true, 6),
    ('SOL', 'Solana', 'crypto', '☀️', true, 9),
    ('ADA', 'Cardano', 'crypto', '♠️', true, 6),
    ('DOT', 'Polkadot', 'crypto', '⭕', true, 10),
    ('DOGE', 'Dogecoin', 'crypto', '🐕', true, 8),
    ('MATIC', 'Polygon', 'crypto', '🔷', true, 18),
    ('AVAX', 'Avalanche', 'crypto', '🔺', true, 18),
    ('SHIB', 'Shiba Inu', 'crypto', '🐶', true, 18),
    ('TON', 'Toncoin', 'crypto', '💎', true, 9),
    ('XMR', 'Monero', 'crypto', '🔒', true, 12),
    ('BCH', 'Bitcoin Cash', 'crypto', '💵', true, 8),
    ('ATOM', 'Cosmos', 'crypto', '🌌', true, 6),
    ('LINK', 'Chainlink', 'crypto', '🔗', true, 18),
    ('UNI', 'Uniswap', 'crypto', '🦄', true, 18),
    ('DAI', 'Dai', 'crypto', '💲', true, 18),
    ('BUSD', 'Binance USD', 'crypto', '💵', true, 18)
ON CONFLICT (symbol) DO NOTHING;

-- Добавляем настройку для языка сайта
INSERT INTO t_p7012082_overnight_exchange_d.system_settings (key, value, description)
VALUES ('site_language', 'ru', 'Язык сайта по умолчанию (ru/en)')
ON CONFLICT (key) DO NOTHING;