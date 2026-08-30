import { Request, Response } from 'express';
import {
  UserError,
  createUser,
  deactivateUser,
  listUsers,
  parseUserId,
  updateUser,
} from '../services/userService';

export async function getUsers(req: Request, res: Response) {
  try {
    const users = await listUsers();

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to load users',
    });
  }
}

export async function postUser(req: Request, res: Response) {
  try {
    const { name, email, phone, role, status, password } = req.body;

    if (!name || !email || !role || !password) {
      res.status(400).json({
        success: false,
        message: 'Name, email, role, and password are required',
      });
      return;
    }

    const user = await createUser({
      name,
      email,
      phone,
      role,
      status,
      password,
      specialisation: req.body.specialisation,
    });

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: user,
    });
  } catch (error) {
    if (error instanceof UserError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
      return;
    }

    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to create user',
    });
  }
}

export async function putUser(req: Request, res: Response) {
  try {
    const id = parseUserId(String(req.params.id));
    const user = await updateUser(id, req.body);

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: user,
    });
  } catch (error) {
    if (error instanceof UserError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
      return;
    }

    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user',
    });
  }
}

export async function patchDeactivateUser(req: Request, res: Response) {
  try {
    const id = parseUserId(String(req.params.id));
    const user = await deactivateUser(id);

    res.status(200).json({
      success: true,
      message: 'User deactivated successfully',
      data: user,
    });
  } catch (error) {
    if (error instanceof UserError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
      return;
    }

    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to deactivate user',
    });
  }
}
