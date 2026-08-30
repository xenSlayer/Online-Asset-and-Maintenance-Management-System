import { Request, Response } from 'express';
import { getPublicStats } from '../services/statsService';

export async function getStats(req: Request, res: Response) {
  try {
    const data = await getPublicStats();

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to load stats',
    });
  }
}
