import { NextRequest } from 'next/server';

export function requestLogger(request: NextRequest): string {
  const requestId = crypto.randomUUID();
  const method = request.method;
  const url = request.nextUrl.pathname;
  const timestamp = new Date().toISOString();

  console.log(JSON.stringify({
    requestId,
    method,
    url,
    timestamp,
    level: 'info'
  }));

  return requestId;
}