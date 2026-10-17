import asyncHandler from 'express-async-handler';
import { dataStore } from '../data/store';

export const createCompany = asyncHandler(async (req, res) => {
  const { name, currency = 'INR', financialYear = '2025-2026' } = req.body ?? {};
  if (!name) return res.status(400).json({ error: 'Company name is required.' });

  const company = dataStore.createCompany({ name, currency, financialYear });
  return res.status(201).json(company);
});

export const listCompanies = asyncHandler(async (_req, res) => {
  return res.json(dataStore.listCompanies());
});

export const createAccount = asyncHandler(async (req, res) => {
  const { companyId = dataStore.companies[0]?.id, code, name, type, openingBalance = 0 } = req.body ?? {};
  if (!companyId || !code || !name || !type) {
    return res.status(400).json({ error: 'Company ID, account code, name and type are required.' });
  }

  const account = dataStore.createAccount(companyId, { code, name, type, openingBalance });
  return res.status(201).json(account);
});

export const listAccounts = asyncHandler(async (req, res) => {
  const companyId = String(req.query.companyId ?? dataStore.companies[0]?.id ?? '');
  return res.json(dataStore.listAccounts(companyId));
});

export const createVoucher = asyncHandler(async (req, res) => {
  const companyId = req.body.companyId ?? dataStore.companies[0]?.id;
  if (!companyId) return res.status(400).json({ error: 'No company selected.' });

  const { voucherType, date, reference, narration, lines } = req.body ?? {};
  if (!voucherType || !date || !Array.isArray(lines) || lines.length === 0) {
    return res.status(400).json({ error: 'Voucher type, date, and at least one line are required.' });
  }

  try {
    const voucher = dataStore.createVoucher(companyId, { voucherType, date, reference, narration, lines });
    return res.status(201).json(voucher);
  } catch (error) {
    return res.status(400).json({ error: (error as Error).message });
  }
});

export const listVouchers = asyncHandler(async (req, res) => {
  const companyId = String(req.query.companyId ?? dataStore.companies[0]?.id ?? '');
  return res.json(dataStore.listVouchers(companyId));
});

export const trialBalance = asyncHandler(async (req, res) => {
  const companyId = String(req.query.companyId ?? dataStore.companies[0]?.id ?? '');
  return res.json(dataStore.getTrialBalance(companyId));
});

export const dashboard = asyncHandler(async (_req, res) => {
  return res.json(dataStore.getDashboard());
});
