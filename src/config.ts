import path from 'path';

export interface MockServerConfig {
  port: number;
  schema: string;
  routes: Record<string, string>;
}

export function loadConfig(): MockServerConfig {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const config = require(path.resolve(process.cwd(), 'mock-server.config.ts')).default;
  return config;
}
