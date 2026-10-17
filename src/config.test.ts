import { describe, expect, it } from 'vitest';
import { config } from '../src/config';

describe('Accounting Notes config', () => {
  it('uses the accounting notes brand name', () => {
    expect(config.appName).toBe('Accounting Notes');
  });

  it('exposes a default server port', () => {
    expect(typeof config.port).toBe('number');
    expect(config.port).toBeGreaterThan(0);
  });
});
