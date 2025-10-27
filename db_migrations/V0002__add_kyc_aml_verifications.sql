-- Add KYC verification table
CREATE TABLE IF NOT EXISTS kyc_verifications (
    id SERIAL PRIMARY KEY,
    client_id INTEGER REFERENCES clients(id),
    verification_level VARCHAR(20) DEFAULT 'none' CHECK (verification_level IN ('none', 'basic', 'advanced', 'premium')),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'approved', 'rejected')),
    document_type VARCHAR(50),
    document_number VARCHAR(100),
    document_front_url VARCHAR(500),
    document_back_url VARCHAR(500),
    selfie_url VARCHAR(500),
    address_proof_url VARCHAR(500),
    rejection_reason TEXT,
    verified_at TIMESTAMP,
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add AML checks table
CREATE TABLE IF NOT EXISTS aml_checks (
    id SERIAL PRIMARY KEY,
    client_id INTEGER REFERENCES clients(id),
    exchange_id INTEGER REFERENCES exchanges(id),
    check_type VARCHAR(50) DEFAULT 'automatic' CHECK (check_type IN ('automatic', 'manual', 'enhanced')),
    risk_level VARCHAR(20) DEFAULT 'low' CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
    risk_score DECIMAL(5, 2) DEFAULT 0,
    sanctions_hit BOOLEAN DEFAULT false,
    pep_hit BOOLEAN DEFAULT false,
    adverse_media_hit BOOLEAN DEFAULT false,
    check_result JSONB DEFAULT '{}',
    notes TEXT,
    checked_by VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add wallet verifications table
CREATE TABLE IF NOT EXISTS wallet_verifications (
    id SERIAL PRIMARY KEY,
    client_id INTEGER REFERENCES clients(id),
    wallet_address VARCHAR(255) NOT NULL,
    currency VARCHAR(20) NOT NULL,
    verification_method VARCHAR(50) DEFAULT 'signature' CHECK (verification_method IN ('signature', 'transaction', 'message')),
    verification_code VARCHAR(100),
    is_verified BOOLEAN DEFAULT false,
    verified_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(client_id, wallet_address, currency)
);

-- Add exchange limits table
CREATE TABLE IF NOT EXISTS exchange_limits (
    id SERIAL PRIMARY KEY,
    verification_level VARCHAR(20) NOT NULL CHECK (verification_level IN ('none', 'basic', 'advanced', 'premium')),
    daily_limit_usd DECIMAL(20, 2) NOT NULL,
    monthly_limit_usd DECIMAL(20, 2) NOT NULL,
    single_transaction_limit_usd DECIMAL(20, 2) NOT NULL,
    requires_kyc BOOLEAN DEFAULT false,
    requires_aml BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add transaction logs for audit
CREATE TABLE IF NOT EXISTS transaction_logs (
    id SERIAL PRIMARY KEY,
    exchange_id INTEGER REFERENCES exchanges(id),
    action VARCHAR(50) NOT NULL,
    status_from VARCHAR(20),
    status_to VARCHAR(20),
    performed_by VARCHAR(100),
    ip_address VARCHAR(50),
    user_agent TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    client_id INTEGER REFERENCES clients(id),
    type VARCHAR(50) NOT NULL CHECK (type IN ('exchange_created', 'exchange_completed', 'exchange_failed', 'kyc_approved', 'kyc_rejected', 'aml_alert')),
    title VARCHAR(255) NOT NULL,
    message TEXT,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default exchange limits
INSERT INTO exchange_limits (verification_level, daily_limit_usd, monthly_limit_usd, single_transaction_limit_usd, requires_kyc, requires_aml) VALUES
('none', 500, 2000, 200, false, false),
('basic', 5000, 20000, 2000, true, false),
('advanced', 50000, 200000, 20000, true, true),
('premium', 1000000, 5000000, 500000, true, true)
ON CONFLICT DO NOTHING;

-- Add columns to clients table for KYC/AML
ALTER TABLE clients ADD COLUMN IF NOT EXISTS verification_level VARCHAR(20) DEFAULT 'none';
ALTER TABLE clients ADD COLUMN IF NOT EXISTS kyc_status VARCHAR(20) DEFAULT 'none';
ALTER TABLE clients ADD COLUMN IF NOT EXISTS aml_status VARCHAR(20) DEFAULT 'none';
ALTER TABLE clients ADD COLUMN IF NOT EXISTS risk_level VARCHAR(20) DEFAULT 'low';
ALTER TABLE clients ADD COLUMN IF NOT EXISTS country_code VARCHAR(3);
ALTER TABLE clients ADD COLUMN IF NOT EXISTS date_of_birth DATE;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMP;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS ip_address VARCHAR(50);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_kyc_verifications_client_id ON kyc_verifications(client_id);
CREATE INDEX IF NOT EXISTS idx_kyc_verifications_status ON kyc_verifications(status);
CREATE INDEX IF NOT EXISTS idx_aml_checks_client_id ON aml_checks(client_id);
CREATE INDEX IF NOT EXISTS idx_aml_checks_exchange_id ON aml_checks(exchange_id);
CREATE INDEX IF NOT EXISTS idx_aml_checks_risk_level ON aml_checks(risk_level);
CREATE INDEX IF NOT EXISTS idx_wallet_verifications_client_id ON wallet_verifications(client_id);
CREATE INDEX IF NOT EXISTS idx_transaction_logs_exchange_id ON transaction_logs(exchange_id);
CREATE INDEX IF NOT EXISTS idx_notifications_client_id ON notifications(client_id, is_read);