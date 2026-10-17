const formatCurrency = (value) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(value);

async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  return response.json();
}

function renderStats(summary) {
  const stats = [
    { label: 'Accounts', value: summary.totalAccounts },
    { label: 'Vouchers', value: summary.totalVouchers },
    { label: 'Debit', value: formatCurrency(summary.totalDebits) },
    { label: 'Credit', value: formatCurrency(summary.totalCredits) },
    { label: 'Net', value: formatCurrency(summary.netPosition) },
  ];

  document.getElementById('statsGrid').innerHTML = stats
    .map(
      (stat) => `
        <div class="stat-card">
          <div class="stat-label">${stat.label}</div>
          <div class="stat-value">${stat.value}</div>
        </div>
      `,
    )
    .join('');
}

function renderAccounts(accounts) {
  const table = `
    <table>
      <thead>
        <tr>
          <th>Code</th>
          <th>Name</th>
          <th>Type</th>
          <th>Opening</th>
        </tr>
      </thead>
      <tbody>
        ${accounts
          .map(
            (account) => `
              <tr>
                <td>${account.code}</td>
                <td>${account.name}</td>
                <td><span class="badge">${account.type}</span></td>
                <td>${formatCurrency(account.openingBalance)}</td>
              </tr>
            `,
          )
          .join('')}
      </tbody>
    </table>
  `;
  document.getElementById('accountsTable').innerHTML = table;
}

function renderVouchers(vouchers) {
  const table = `
    <table>
      <thead>
        <tr>
          <th>Voucher</th>
          <th>Date</th>
          <th>Type</th>
          <th>Reference</th>
        </tr>
      </thead>
      <tbody>
        ${vouchers
          .slice(0, 6)
          .map(
            (voucher) => `
              <tr>
                <td>${voucher.id}</td>
                <td>${voucher.date}</td>
                <td>${voucher.voucherType}</td>
                <td>${voucher.reference}</td>
              </tr>
            `,
          )
          .join('')}
      </tbody>
    </table>
  `;
  document.getElementById('vouchersTable').innerHTML = table;
}

async function boot() {
  try {
    const summary = await fetchJson('/api/dashboard');
    const accounts = await fetchJson('/api/accounts');
    const vouchers = await fetchJson('/api/vouchers');

    renderStats(summary);
    renderAccounts(accounts);
    renderVouchers(vouchers);
  } catch (error) {
    document.getElementById('statsGrid').innerHTML = `
      <div class="stat-card">
        <div class="stat-label">Status</div>
        <div class="stat-value">Unable to load data</div>
      </div>
    `;
    console.error(error);
  }
}

boot();
