import express, { type Express, type Request, type Response } from 'express';
import cors from 'cors';
import { config } from './config';
import { appMeta } from './data/store';
import path from 'node:path';
import { accountingRouter } from './routes/accountingRoutes';

export const app: Express = express();

const staticDir = path.resolve(process.cwd(), 'public');

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: appMeta.name,
    version: appMeta.version,
    timestamp: new Date().toISOString(),
  });
});

app.use('/api', accountingRouter);

app.get('/', (_req: Request, res: Response) => {
  res.sendFile(path.join(staticDir, 'index.html'));
});

const port = config.port;

export function startServer() {
  app.listen(port, () => {
    console.log(`${appMeta.name} is running on http://localhost:${port}`);
  });
}

if (require.main === module) {
  startServer();
}
