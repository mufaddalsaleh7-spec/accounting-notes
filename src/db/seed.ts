import { prisma } from '../prismaClient';

async function seed() {
  const existing = await prisma.company.findFirst();
  if (existing) {
    console.log('Seed: company exists, skipping');
    return;
  }

  const company = await prisma.company.create({ data: { name: 'Accounting Notes Demo', baseCurrency: 'INR' } });

  const cash = await prisma.account.create({ data: { companyId: company.id, code: '1001', name: 'Cash', type: 'Asset', openingBalance: 150000 } });
  const sales = await prisma.account.create({ data: { companyId: company.id, code: '2001', name: 'Sales', type: 'Income' } });
  const bank = await prisma.account.create({ data: { companyId: company.id, code: '1010', name: 'Bank', type: 'Asset', openingBalance: 500000 } });

  await prisma.voucher.create({
    data: {
      companyId: company.id,
      date: new Date('2025-01-12'),
      type: 'Receipt',
      reference: 'RCPT-1001',
      narration: 'Customer payment',
      lines: {
        create: [
          { accountId: cash.id, debit: 30000, credit: 0, narration: 'Cash received' },
          { accountId: sales.id, debit: 0, credit: 30000, narration: 'Sales income' },
        ],
      },
    },
  });

  console.log('Seed complete');
}

seed()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
