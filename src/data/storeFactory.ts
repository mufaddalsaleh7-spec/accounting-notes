import { createStore } from './storeFactory';

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

export const dataStore = createStore();

export const appMeta = {
  name: 'Accounting Notes',
  tagline: 'Professional accounting software for modern businesses',
  version: '1.0.0',
};

export { createStore };
