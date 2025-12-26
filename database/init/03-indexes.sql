CREATE INDEX idx_logs_timestamp ON logs (timestamp DESC);
CREATE INDEX idx_logs_status_code ON logs (status_code);
CREATE INDEX idx_logs_service_name ON logs (service_name);
CREATE INDEX idx_logs_service_timestamp ON logs (service_name, timestamp DESC);
CREATE INDEX idx_logs_status_timestamp ON logs (status_code, timestamp DESC);
CREATE INDEX idx_api_keys_is_active ON api_keys (is_active) WHERE is_active = TRUE;

