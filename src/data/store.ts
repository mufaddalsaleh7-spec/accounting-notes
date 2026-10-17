import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

export type AccountType = 'Asset' | 'Liability' | 'Equity' | 'Income' | 'Expense';

export interface Company {
  id: string;
  name: string;
  currency: string;
  financialYear: string;
}

export interface Account {
  id: string;
  companyId: string;
  code: string;
  name: string;
  type: AccountType;
  parentId?: string;
  openingBalance: number;
}

export interface VoucherLine {
  id: string;
  accountId: string;
  debit: number;
  credit: number;
  narration?: string;
}

export interface Voucher {
  id: string;
  companyId: string;
  voucherType: 'Receipt' | 'Payment' | 'Journal' | 'Sales' | 'Purchase';
  date: string;
  reference: string;
  narration?: string;
  lines: VoucherLine[];
  createdAt: string;
}

export interface DashboardSummary {
  companyName: string;
  totalAccounts: number;
  totalVouchers: number;
  totalDebits: number;
  totalCredits: number;
  netPosition: number;
}

export interface Store {
  companies: Company[];
  accounts: Account[];
  vouchers: Voucher[];
  getDashboard(): DashboardSummary;
  listCompanies(): Company[];
  getCompany(id: string): Company | undefined;
  listAccounts(companyId: string): Account[];
  createCompany(data: Pick<Company, 'name' | 'currency' | 'financialYear'>): Company;
  createAccount(companyId: string, data: Omit<Account, 'id' | 'companyId'>): Account;
  getTrialBalance(companyId: string): Array<{ accountName: string; code: string; debit: number; credit: number }>; 
  listVouchers(companyId: string): Voucher[];
  createVoucher(companyId: string, payload: Omit<Voucher, 'id' | 'companyId' | 'createdAt'>): Voucher;
}

function makeId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

export function createStore(): Store {
  const company: Company = {
    id: 'cmp-1',
    name: 'Accounting Notes Demo',
    currency: 'INR',
    financialYear: '2025-2026',
  };

  const accounts: Account[] = [
    { id: 'ac-1', companyId: company.id, code: '1001', name: 'Cash', type: 'Asset', openingBalance: 150000 },
    { id: 'ac-2', companyId: company.id, code: '2001', name: 'Sales', type: 'Income', openingBalance: 0 },
    { id: 'ac-3', companyId: company.id, code: '3001', name: 'Purchase', type: 'Expense', openingBalance: 0 },
    { id: 'ac-4', companyId: company.id, code: '4001', name: 'Bank', type: 'Asset', openingBalance: 500000 },
  ];

  const vouchers: Voucher[] = [
    {
      id: 'vou-1',
      companyId: company.id,
      voucherType: 'Receipt',
      date: '2025-01-12',
      reference: 'RCPT-1001',
      narration: 'Customer payment received',
      lines: [
        { id: 'line-1', accountId: 'ac-1', debit: 30000, credit: 0, narration: 'Cash received' },
        { id: 'line-2', accountId: 'ac-2', debit: 0, credit: 30000, narration: 'Sales income' },
      ],
      createdAt: '2025-01-12T09:00:00.000Z',
    },
  ];

  const listCompanies = () => [company];

  return {
    companies: [company],
    accounts,
    vouchers,
    getDashboard() {
      const totalDebits = vouchers.reduce((sum, voucher) => sum + voucher.lines.reduce((lineTotal, line) => lineTotal + line.debit, 0), 0);
      const totalCredits = vouchers.reduce((sum, voucher) => sum + voucher.lines.reduce((lineTotal, line) => lineTotal + line.credit, 0), 0);
      return {
        companyName: company.name,
        totalAccounts: accounts.length,
        totalVouchers: vouchers.length,
        totalDebits,
        totalCredits,
        netPosition: totalDebits - totalCredits,
      };
    },
    listCompanies,
    getCompany(id: string) {
      return listCompanies().find((entry) => entry.id === id);
    },
    listAccounts(companyId: string) {
      return accounts.filter((entry) => entry.companyId === companyId);
    },
    createCompany(data) {
      const newCompany: Company = { id: makeId('cmp'), ...data };
      this.companies.push(newCompany);
      return newCompany;
    },
    createAccount(companyId, data) {
      const account: Account = { id: makeId('ac'), companyId, ...data, openingBalance: data.openingBalance ?? 0 };
      accounts.push(account);
      return account;
    },
    getTrialBalance(companyId: string) {
      const rows = new Map<string, { accountName: string; code: string; debit: number; credit: number }>();

      for (const account of accounts.filter((entry) => entry.companyId === companyId)) {
        rows.set(account.id, { accountName: account.name, code: account.code, debit: 0, credit: 0 });
      }

      for (const voucher of vouchers.filter((entry) => entry.companyId === companyId)) {
        for (const line of voucher.lines) {
          const account = rows.get(line.accountId);
          if (!account) continue;
          account.debit += line.debit;
          account.credit += line.credit;
        }
      }

      return Array.from(rows.values());
    },
    listVouchers(companyId: string) {
      return vouchers.filter((entry) => entry.companyId === companyId);
    },
    createVoucher(companyId: string, payload) {
      const totalDebit = payload.lines.reduce((sum, line) => sum + Number(line.debit ?? 0), 0);
      const totalCredit = payload.lines.reduce((sum, line) => sum + Number(line.credit ?? 0), 0);
      if (totalDebit !== totalCredit) {
        throw new Error('Voucher totals must balance. Debit and credit amounts must match.');
      }

      const voucher: Voucher = {
        id: makeId('vou'),
        companyId,
        ...payload,
        createdAt: new Date().toISOString(),
      };
      vouchers.push(voucher);
      return voucher;
    },
  };
}

export const dataStore = createStore();

export const appMeta = {
  name: 'Accounting Notes',
  tagline: 'Professional accounting software for modern businesses',
  version: '1.0.0',
};
