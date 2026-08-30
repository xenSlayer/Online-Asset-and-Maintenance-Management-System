import { Request, Response } from 'express';
import { listMaintenanceRecords } from '../services/maintenanceRecordService';

export async function getMaintenanceRecords(req: Request, res: Response) {
  try {
    const data = await listMaintenanceRecords();

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to load maintenance records',
    });
  }
}
