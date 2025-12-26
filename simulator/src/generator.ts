import { config } from './config.js';

export function generateRandomIp(): string {
  const octet = () => Math.floor(Math.random() * 256);
  return `${octet()}.${octet()}.${octet()}.${octet()}`;
}

export function generateRandomLatency(): number {
  const rand = Math.random();
  
  if (rand < 0.7) {
    return Math.floor(Math.random() * 190) + 10;
  }
  
  if (rand < 0.9) {
    return Math.floor(Math.random() * 300) + 200;
  }
  
  return Math.floor(Math.random() * 1500) + 500;
}

export function generateRandomStatusCode(): number {
  const rand = Math.random();
  
  if (rand < 0.70) return 200;
  if (rand < 0.80) return 201;
  if (rand < 0.85) return 400;
  if (rand < 0.90) return 404;
  if (rand < 0.93) return 500;
  if (rand < 0.95) return 503;
  
  const otherCodes = [301, 302, 401, 403, 429];
  return otherCodes[Math.floor(Math.random() * otherCodes.length)];
}

export function generateRandomTimestamp(): string {
  const now = Date.now();
  const fiveMinutesInMs = 5 * 60 * 1000;
  const randomOffset = Math.floor(Math.random() * fiveMinutesInMs);
  const timestamp = new Date(now - randomOffset);
  return timestamp.toISOString();
}

export function generateLogEvent() {
  const serviceName = config.serviceNames[Math.floor(Math.random() * config.serviceNames.length)];
  
  return {
    serviceName,
    timestamp: generateRandomTimestamp(),
    statusCode: generateRandomStatusCode(),
    latencyMs: generateRandomLatency(),
    originIp: generateRandomIp(),
  };
}

export function generateLogBatch(size: number) {
  return Array.from({ length: size }, () => generateLogEvent());
}

