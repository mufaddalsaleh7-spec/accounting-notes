import { randomUUID } from 'node:crypto';

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
  voucherType: 'Receipt' | 'Payment' | 'Journal' | 'Sales' | 'Purchase' | 'Contra';
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

function makeId(prefix: string) {
  return `${prefix}-${randomUUID().slice(0, 8)}`;
}

export function createStore() {
  const company: Company = {
    id: 'cmp-demo',
    name: 'Accounting Notes Demo',
    currency: 'INR',
    financialYear: '2025-2026',
  };

  const accounts: Account[] = [
    { id: 'ac-cash', companyId: company.id, code: '1001', name: 'Cash', type: 'Asset', openingBalance: 150000 },
    { id: 'ac-bank', companyId: company.id, code: '1002', name: 'Bank', type: 'Asset', openingBalance: 500000 },
    { id: 'ac-sales', companyId: company.id, code: '4001', name: 'Sales', type: 'Income', openingBalance: 0 },
    { id: 'ac-purchase', companyId: company.id, code: '5001', name: 'Purchase', type: 'Expense', openingBalance: 0 },
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
        { id: 'line-1', accountId: 'ac-cash', debit: 30000, credit: 0, narration: 'Cash received' },
        { id: 'line-2', accountId: 'ac-sales', debit: 0, credit: 30000, narration: 'Sales income' },
      ],
      createdAt: '2025-01-12T09:00:00.000Z',
    },
  ];

  return {
    companies: [company],
    accounts,
    vouchers,
    getDashboard(): DashboardSummary {
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
    listCompanies() {
      return this.companies;
    },
    getCompany(id: string) {
      return this.companies.find((entry) => entry.id === id);
    },
    listAccounts(companyId: string) {
      return this.accounts.filter((entry) => entry.companyId === companyId);
    },
    createCompany(data) {
      const newCompany: Company = {
        id: makeId('cmp'),
        name: data.name,
        currency: data.currency,
        financialYear: data.financialYear,
      };
      this.companies.push(newCompany);
      return newCompany;
    },
    createAccount(companyId: string, data: any) {
      const account: Account = {
        id: makeId('ac'),
        companyId,
        code: data.code,
        name: data.name,
        type: data.type,
        openingBalance: data.openingBalance ?? 0,
      };
      this.accounts.push(account);
      return account;
    },
    getTrialBalance(companyId: string) {
      const rows = new Map<string, { accountName: string; code: string; debit: number; credit: number }>();
      for (const account of this.accounts.filter((entry) => entry.companyId === companyId)) {
        rows.set(account.id, { accountName: account.name, code: account.code, debit: 0, credit: 0 });
      }
      for (const voucher of this.vouchers.filter((entry) => entry.companyId === companyId)) {
        for (const line of voucher.lines) {
          const entry = rows.get(line.accountId);
          if (!entry) continue;
          entry.debit += line.debit;
          entry.credit += line.credit;
        }
      }
      return Array.from(rows.values());
    },
    listVouchers(companyId: string) {
      return this.vouchers.filter((entry) => entry.companyId === companyId);
    },
    createVoucher(companyId: string, payload: any) {
      const totalDebit = payload.lines.reduce((sum: number, line: any) => sum + Number(line.debit ?? 0), 0);
      const totalCredit = payload.lines.reduce((sum: number, line: any) => sum + Number(line.credit ?? 0), 0);
      if (totalDebit !== totalCredit) {
        throw new Error('Voucher totals must balance. Debit and credit amounts must match.');
      }
      const voucher: Voucher = {
        id: makeId('vou'),
        companyId,
        voucherType: payload.voucherType,
        date: payload.date,
        reference: payload.reference ?? `REF-${Date.now()}`,
        narration: payload.narration,
        lines: payload.lines.map((line: any) => ({
          id: makeId('line'),
          accountId: line.accountId,
          debit: Number(line.debit ?? 0),
          credit: Number(line.credit ?? 0),
          narration: line.narration,
        })),
        createdAt: new Date().toISOString(),
      };
      this.vouchers.push(voucher);
      return voucher;
    },
  } as any;
}
