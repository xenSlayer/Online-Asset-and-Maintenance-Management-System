import { Request, Response } from 'express';
import { getDashboardData } from '../services/dashboardService';

export async function getDashboard(req: Request, res: Response) {
  try {
    const data = await getDashboardData();

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to load dashboard data',
    });
  }
}
