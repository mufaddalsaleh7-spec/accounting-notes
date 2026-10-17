import { Router, type Request, type Response } from 'express';
import { authUser, getUserFromRequest, issueToken } from '../auth';

export const authRouter = Router();

authRouter.post('/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body ?? {};
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const user = authUser(email, password);
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  const token = issueToken(user);
  return res.json({ token, user });
});

authRouter.get('/auth/me', (req: Request, res: Response) => {
  const user = getUserFromRequest(req);
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  return res.json(user);
});
