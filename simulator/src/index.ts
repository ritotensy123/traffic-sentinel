import { config } from './config.js';
import { generateLogBatch } from './generator.js';
import { sendBatch } from './client.js';

const intervalMs = (config.BATCH_SIZE / config.REQUESTS_PER_SECOND) * 1000;

let isRunning = true;

async function runSimulation(): Promise<void> {
  console.log('Traffic Simulator Started');
  console.log('Configuration:', {
    apiUrl: config.API_URL,
    apiKey: '[REDACTED]',
    requestsPerSecond: config.REQUESTS_PER_SECOND,
    batchSize: config.BATCH_SIZE,
    intervalMs: `${intervalMs}ms`,
    services: config.serviceNames,
  });

  while (isRunning) {
    const batch = generateLogBatch(config.BATCH_SIZE);
    const result = await sendBatch(batch);
    
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] Sent: ${result.success} logs | Failed: ${result.failed} logs`);
    
    if (isRunning) {
      await new Promise((resolve) => setTimeout(resolve, intervalMs));
    }
  }
}

function gracefulShutdown(signal: string): void {
  console.log(`Received ${signal}, shutting down gracefully...`);
  isRunning = false;
  
  setTimeout(() => {
    console.log('Shutdown complete');
    process.exit(0);
  }, 1000);
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

runSimulation().catch((error) => {
  console.error('Fatal error in simulation:', error);
  process.exit(1);
});

