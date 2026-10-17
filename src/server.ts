import express, { type Express, type Request, type Response } from 'express';
import cors from 'cors';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { config } from './config';
import { appMeta } from './data/store';
import { accountingRouter } from './routes/accountingRoutes';
import { authRouter } from './routes/authRoutes';

export const app: Express = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const staticDir = path.resolve(__dirname, '../public');

app.use(cors());
app.use(express.json());
app.use(express.static(staticDir));

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: appMeta.name,
    version: appMeta.version,
    timestamp: new Date().toISOString(),
  });
});

app.use('/api', authRouter);
app.use('/api', accountingRouter);

app.get('/dashboard', (_req, res) => {
  res.sendFile(path.join(staticDir, 'index.html'));
});

app.get('*', (_req, res) => {
  res.sendFile(path.join(staticDir, 'index.html'));
});

const port = config.port;

export function startServer() {
  app.listen(port, () => {
    console.log(`${appMeta.name} is running on http://localhost:${port}`);
  });
}

const isMain = process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);
if (isMain) {
  startServer();
}
