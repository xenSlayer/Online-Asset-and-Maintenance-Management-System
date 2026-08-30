import express from 'express';
import cors from 'cors';
import routes from './routes';

const app = express();

function getAllowedOrigins(): string[] | true {
  const origins = [
    process.env.FRONTEND_URL,
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
    process.env.VERCEL_BRANCH_URL
      ? `https://${process.env.VERCEL_BRANCH_URL}`
      : null,
  ].filter((origin): origin is string => Boolean(origin));

  if (origins.length === 0) {
    return true;
  }

  return origins;
}

app.use(
  cors({
    origin: getAllowedOrigins(),
    credentials: true,
  }),
);
app.use(express.json());

app.use('/api', routes);

export default app;
