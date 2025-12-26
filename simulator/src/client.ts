import { config } from './config.js';

interface LogEvent {
  serviceName: string;
  timestamp: string;
  statusCode: number;
  latencyMs: number;
  originIp: string;
}

interface SendResult {
  success: number;
  failed: number;
}

export async function sendBatch(logs: LogEvent[]): Promise<SendResult> {
  try {
    const response = await fetch(`${config.API_URL}/api/logs/batch`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': config.API_KEY,
      },
      body: JSON.stringify(logs),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      console.error(`API request failed with status ${response.status}: ${errorText}`);
      return { success: 0, failed: logs.length };
    }

    return { success: logs.length, failed: 0 };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`Network error sending batch: ${errorMessage}`);
    return { success: 0, failed: logs.length };
  }
}

