import { Request, Response } from 'express';
import { AuthError, loginUser } from '../services/authService';

export async function login(req: Request, res: Response) {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      res.status(400).json({
        success: false,
        message: 'Email, password, and role are required',
      });
      return;
    }

    const result = await loginUser({ email, password, role });

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: result,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
      return;
    }

    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
    });
  }
}
