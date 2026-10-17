:root {
  --bg: #f4f7fb;
  --panel: #ffffff;
  --border: #dfe7f2;
  --text: #112033;
  --muted: #607089;
  --primary: #0f56b3;
  --primary-alt: #0a3d80;
  --success: #1aa56b;
  --warning: #d97706;
  --danger: #dc2626;
  --shadow: 0 10px 30px rgba(17, 32, 51, 0.08);
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: Inter, "Segoe UI", sans-serif;
  background: var(--bg);
  color: var(--text);
}

button {
  cursor: pointer;
  border: none;
  border-radius: 10px;
  padding: 0.8rem 1.1rem;
  font-weight: 600;
}

.app-shell {
  max-width: 1240px;
  margin: 0 auto;
  padding: 2rem 1.25rem 3rem;
}

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, #132f50, #0a3d80);
  color: white;
  padding: 1.5rem 1.5rem;
  border-radius: 18px;
  box-shadow: var(--shadow);
}

.eyebrow {
  margin: 0 0 0.35rem;
  text-transform: uppercase;
  letter-spacing: 0.12rem;
  font-size: 0.7rem;
  opacity: 0.8;
}

h1 {
  margin: 0;
  font-size: clamp(2rem, 3vw, 2.6rem);
}

.primary-button {
  background: #eff6ff;
  color: var(--primary-alt);
}

.secondary-button {
  background: #eef4ff;
  color: var(--primary-alt);
}

.content {
  margin-top: 2rem;
  display: grid;
  gap: 1.5rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
}

.stat-card,
.panel {
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: 16px;
  box-shadow: var(--shadow);
}

.stat-card {
  padding: 1.2rem 1.1rem;
}

.stat-label {
  color: var(--muted);
  font-size: 0.82rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.stat-value {
  margin-top: 0.4rem;
  font-weight: 700;
  font-size: clamp(1.3rem, 2.4vw, 2rem);
}

.panel {
  padding: 1.2rem;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

h2 {
  margin: 0;
  font-size: 1.2rem;
}

.table {
  overflow: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 0.9rem 0.8rem;
  border-bottom: 1px solid var(--border);
  text-align: left;
  font-size: 0.96rem;
}

th {
  background: #f8faff;
  color: var(--muted);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-size: 0.74rem;
}

.badge {
  display: inline-flex;
  align-items: center;
  padding: 0.35rem 0.7rem;
  border-radius: 999px;
  background: #eef8f4;
  color: var(--success);
  font-weight: 700;
  font-size: 0.72rem;
}

@media (max-width: 720px) {
  .topbar,
  .panel-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.8rem;
  }
}
