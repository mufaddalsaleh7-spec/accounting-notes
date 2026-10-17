import express, { type Express, type Request, type Response } from 'express';
import cors from 'cors';
import { config } from './config';
import { appMeta, dataStore } from './data/store';
import path from 'node:path';

export const app: Express = express();

const staticDir = path.resolve(process.cwd(), 'public');

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: appMeta.name,
    version: appMeta.version,
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/dashboard', (_req: Request, res: Response) => {
  res.json(dataStore.getDashboard());
});

app.get('/api/companies', (_req: Request, res: Response) => {
  res.json(dataStore.listCompanies());
});

app.post('/api/companies', (req: Request, res: Response) => {
  const { name, currency = 'INR', financialYear = '2025-2026' } = req.body ?? {};
  if (!name || typeof name !== 'string') {
    return res.status(400).json({ error: 'Company name is required.' });
  }

  const company = dataStore.createCompany({ name, currency, financialYear });
  return res.status(201).json(company);
});

app.get('/api/accounts', (req: Request, res: Response) => {
  const companyId = req.query.companyId as string || dataStore.companies[0].id;
  res.json(dataStore.listAccounts(companyId));
});

app.post('/api/accounts', (req: Request, res: Response) => {
  const companyId = req.body.companyId ?? dataStore.companies[0].id;
  const { code, name, type, openingBalance = 0 } = req.body ?? {};

  if (!code || !name || !type) {
    return res.status(400).json({ error: 'Account code, name and type are required.' });
  }

  const account = dataStore.createAccount(companyId, {
    code,
    name,
    type,
    openingBalance,
  });

  return res.status(201).json(account);
});

app.get('/api/vouchers', (req: Request, res: Response) => {
  const companyId = req.query.companyId as string || dataStore.companies[0].id;
  res.json(dataStore.listVouchers(companyId));
});

app.post('/api/vouchers', (req: Request, res: Response) => {
  const companyId = req.body.companyId ?? dataStore.companies[0].id;
  const { voucherType, date, reference, narration, lines } = req.body ?? {};

  if (!voucherType || !date || !Array.isArray(lines) || lines.length === 0) {
    return res.status(400).json({ error: 'Voucher type, date, and at least one line are required.' });
  }

  try {
    const voucher = dataStore.createVoucher(companyId, {
      voucherType,
      date,
      reference: reference ?? `REF-${Date.now()}`,
      narration,
      lines,
    });
    return res.status(201).json(voucher);
  } catch (error) {
    return res.status(400).json({ error: (error as Error).message });
  }
});

app.get('/api/reports/trial-balance', (req: Request, res: Response) => {
  const companyId = req.query.companyId as string || dataStore.companies[0].id;
  res.json(dataStore.getTrialBalance(companyId));
});

app.get('/', (_req: Request, res: Response) => {
  res.sendFile(path.join(staticDir, 'index.html'));
});

const port = config.port;

export function startServer() {
  app.listen(port, () => {
    console.log(`${appMeta.name} is running on http://localhost:${port}`);
  });
}

if (require.main === module) {
  startServer();
}
