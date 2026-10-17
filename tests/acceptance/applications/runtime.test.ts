import { describe, expect, it } from 'vitest';
import request from 'supertest';
import { app } from '../../src/server';

describe('Accounting Notes runtime', () => {
  it('serves the health endpoint', async () => {
    const response = await request(app).get('/api/health');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
    expect(response.body.service).toBe('Accounting Notes');
  });

  it('returns the dashboard summary', async () => {
    const response = await request(app).get('/api/dashboard');
    expect(response.status).toBe(200);
    expect(response.body.companyName).toBeDefined();
    expect(response.body.totalAccounts).toBeGreaterThan(0);
  });
});
