import { Request, Response } from 'express';
import {
  TechnicianError,
  getTechnicianById,
  listTechnicians,
  parseTechnicianId,
  updateTechnician,
} from '../services/technicianService';

export async function getTechnicians(req: Request, res: Response) {
  try {
    const technicians = await listTechnicians();

    res.status(200).json({
      success: true,
      data: technicians,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to load technicians',
    });
  }
}

export async function getTechnician(req: Request, res: Response) {
  try {
    const id = parseTechnicianId(decodeURIComponent(String(req.params.id)));
    const technician = await getTechnicianById(id);

    res.status(200).json({
      success: true,
      data: technician,
    });
  } catch (error) {
    if (error instanceof TechnicianError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
      return;
    }

    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to load technician',
    });
  }
}

export async function putTechnician(req: Request, res: Response) {
  try {
    const id = parseTechnicianId(decodeURIComponent(String(req.params.id)));
    const { name, email, phone, specialisation, status, password } = req.body;

    const technician = await updateTechnician(id, {
      name,
      email,
      phone,
      specialisation,
      status,
      password,
    });

    res.status(200).json({
      success: true,
      message: 'Technician updated successfully',
      data: technician,
    });
  } catch (error) {
    if (error instanceof TechnicianError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
      return;
    }

    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to update technician',
    });
  }
}
