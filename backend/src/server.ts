import dotenv from 'dotenv';
import app from './app';
import { connectDatabase } from './config/database';

dotenv.config();

const PORT = process.env.PORT || 3000;

async function startServer() {
  await connectDatabase();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
