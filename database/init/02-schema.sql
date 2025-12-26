CREATE TABLE api_keys (
    id SERIAL PRIMARY KEY,
    key_hash VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE logs (
    id BIGSERIAL,
    service_name VARCHAR(64) NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL,
    status_code SMALLINT NOT NULL,
    latency_ms INTEGER NOT NULL,
    origin_ip INET NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT logs_status_code_check CHECK (status_code >= 100 AND status_code <= 599),
    CONSTRAINT logs_latency_ms_check CHECK (latency_ms >= 0 AND latency_ms <= 300000)
);

SELECT create_hypertable('logs', 'timestamp', if_not_exists => TRUE);

