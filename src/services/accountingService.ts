import asyncHandler from 'express-async-handler';
import { prisma } from '../prismaClient';

export const createCompany = asyncHandler(async (req, res) => {
  const { name, baseCurrency = 'INR' } = req.body;
  if (!name) return res.status(400).json({ error: 'Company name required' });
  const company = await prisma.company.create({ data: { name, baseCurrency } });
  res.status(201).json(company);
});

export const listCompanies = asyncHandler(async (_req, res) => {
  const companies = await prisma.company.findMany();
  res.json(companies);
});

export const createAccount = asyncHandler(async (req, res) => {
  const { companyId, code, name, type = 'Asset', openingBalance = 0 } = req.body;
  if (!companyId || !code || !name) return res.status(400).json({ error: 'Missing fields' });
  const account = await prisma.account.create({ data: { companyId, code, name, type, openingBalance } });
  res.status(201).json(account);
});

export const listAccounts = asyncHandler(async (req, res) => {
  const companyId = String(req.query.companyId);
  const accounts = await prisma.account.findMany({ where: { companyId } });
  res.json(accounts);
});

export const createVoucher = asyncHandler(async (req, res) => {
  const { companyId, date, type, reference, narration, lines } = req.body;
  if (!companyId || !date || !Array.isArray(lines) || lines.length === 0) return res.status(400).json({ error: 'Missing voucher fields' });

  const totalDebit = lines.reduce((s, l) => s + Number(l.debit ?? 0), 0);
  const totalCredit = lines.reduce((s, l) => s + Number(l.credit ?? 0), 0);
  if (totalDebit !== totalCredit) return res.status(400).json({ error: 'Voucher must balance' });

  const voucher = await prisma.$transaction(async (tx) => {
    const v = await tx.voucher.create({ data: { companyId, date: new Date(date), type, reference, narration } });
    for (const line of lines) {
      await tx.voucherLine.create({ data: { voucherId: v.id, accountId: line.accountId, debit: line.debit ?? 0, credit: line.credit ?? 0, narration: line.narration } });
    }
    return v;
  });

  res.status(201).json(voucher);
});

export const listVouchers = asyncHandler(async (req, res) => {
  const companyId = String(req.query.companyId);
  const vouchers = await prisma.voucher.findMany({ where: { companyId }, include: { lines: true } });
  res.json(vouchers);
});

export const trialBalance = asyncHandler(async (req, res) => {
  const companyId = String(req.query.companyId);
  // compute debits/credits per account
  const accounts = await prisma.account.findMany({ where: { companyId } });
  const lines = await prisma.voucherLine.findMany({ where: { account: { companyId } }, include: { account: true } });

  const map = new Map();
  for (const acc of accounts) map.set(acc.id, { accountName: acc.name, code: acc.code, debit: 0, credit: 0 });
  for (const ln of lines) {
    const entry = map.get(ln.accountId);
    if (!entry) continue;
    entry.debit = Number(entry.debit) + Number(ln.debit);
    entry.credit = Number(entry.credit) + Number(ln.credit);
  }
  res.json(Array.from(map.values()));
});
