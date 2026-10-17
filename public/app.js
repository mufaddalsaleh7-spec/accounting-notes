:root {
  --bg: #f2f7ff;
  --panel: #ffffff;
  --surface: #eef4ff;
  --border: #dfe9f5;
  --primary: #0f4ea8;
  --primary-dark: #0b2a48;
  --success: #1f9d73;
  --warning: #df9920;
  --danger: #d64040;
  --text: #11233c;
  --muted: #5b6f86;
  --shadow: 0 10px 30px rgba(17, 35, 60, 0.08);
}

* { box-sizing: border-box; }
body {
  margin: 0;
  background: linear-gradient(180deg, #eef5ff 0%, #f6f8fc 100%);
  font-family: Inter, 'Segoe UI', sans-serif;
  color: var(--text);
}
button, input { font: inherit; }
button { cursor: pointer; }

.app-shell { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 24px; }
.login-card, .dashboard { width: min(1200px, 100%); }

.login-card {
  display: grid; grid-template-columns: 1.2fr 0.8fr; background: var(--panel); border: 1px solid var(--border); border-radius: 24px; overflow: hidden; box-shadow: var(--shadow);
}
.login-hero {
  padding: 48px;
  background: linear-gradient(135deg, var(--primary-dark), var(--primary));
  color: #fff;
}
.login-hero h1 { font-size: clamp(2rem, 3vw, 3rem); margin: 0 0 12px; }
.login-hero p { opacity: 0.9; margin: 0; line-height: 1.6; }
.login-hero .chips { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 26px; }
.login-hero .chips span {
  background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.2); padding: 8px 12px; border-radius: 999px; font-size: 0.8rem;
}
.login-form {
  padding: 32px 28px; display: flex; flex-direction: column; justify-content: center;
}
.login-form h2 { margin: 0 0 8px; font-size: 1.8rem; }
.login-form .muted { color: var(--muted); margin-bottom: 20px; }
.label { display: block; font-weight: 600; margin-bottom: 8px; }
.input {
  width: 100%; border: 1px solid var(--border); background: #f9fbff; border-radius: 12px; padding: 12px 14px; margin-bottom: 16px; font-size: 1rem;
}
.primary-btn {
  background: linear-gradient(135deg, var(--primary), #1e6ce4); color: #fff; border: none; border-radius: 12px; padding: 12px 16px; font-weight: 700; box-shadow: 0 10px 20px rgba(15, 78, 168, 0.2);
}
.secondary-btn { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 10px 14px; font-weight: 600; }
.form-inline { display: flex; gap: 12px; align-items: center; }

.dashboard { display: grid; gap: 24px; }
.topbar {
  display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 18px 22px; background: var(--panel); border: 1px solid var(--border); border-radius: 18px; box-shadow: var(--shadow); 
}
.brand { font-size: 1.5rem; font-weight: 800; }
.nav { display: flex; gap: 10px; flex-wrap: wrap; }
.nav .tab { border: 1px solid var(--border); background: #f8fbff; border-radius: 12px; padding: 10px 12px; }
.user-pill { background: var(--surface); border: 1px solid var(--border); padding: 8px 12px; border-radius: 999px; }

.stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 18px; }
.stat-card, .panel {
  background: var(--panel); border: 1px solid var(--border); border-radius: 18px; box-shadow: var(--shadow);
}
.stat-card { padding: 18px; }
.stat-label { color: var(--muted); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.08em; }
.stat-value { margin-top: 10px; font-size: 2rem; font-weight: 800; }

.panel { padding: 18px; }
.panel-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; }
.panel h3 { margin: 0; }
.table-wrap { overflow: auto; }
table { width: 100%; border-collapse: collapse; }
th, td { padding: 12px 10px; border-bottom: 1px solid var(--border); text-align: left; }
th { color: var(--muted); font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.06em; }
.badge {
  display: inline-block; padding: 6px 10px; background: rgba(31, 157, 115, 0.1); color: var(--success); border-radius: 999px; font-weight: 700; font-size: 0.72rem;
}

.form-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px; }
.alert { padding: 12px; border-radius: 12px; margin-bottom: 16px; }
.alert.error { background: rgba(214, 64, 64, 0.08); color: var(--danger); border: 1px solid rgba(214, 64, 64, 0.15); }
.alert.success { background: rgba(31, 157, 115, 0.08); color: var(--success); border: 1px solid rgba(31, 157, 115, 0.15); }

@media (max-width: 760px) {
  .login-card { grid-template-columns: 1fr; }
  .topbar { flex-direction: column; align-items: flex-start; }
}
