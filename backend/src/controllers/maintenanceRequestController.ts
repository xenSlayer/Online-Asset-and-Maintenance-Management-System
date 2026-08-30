import { Request, Response } from 'express';
import {
  MaintenanceRequestError,
  approveMaintenanceRequest,
  assignMaintenanceRequest,
  completeMaintenanceRequest,
  createMaintenanceRequest,
  deleteMaintenanceRequest,
  isPrismaForeignKeyError,
  listMaintenanceRequests,
  parseRequestId,
  updateMaintenanceRequestProgress,
} from '../services/maintenanceRequestService';

export async function getMaintenanceRequests(req: Request, res: Response) {
  try {
    if (!req.auth) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const requests = await listMaintenanceRequests(req.auth);

    res.status(200).json({
      success: true,
      data: requests,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to load maintenance requests',
    });
  }
}

export async function postMaintenanceRequest(req: Request, res: Response) {
  try {
    if (!req.auth) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const { assetId, description, priority, requestDate } = req.body;

    if (!assetId || !description || !priority) {
      res.status(400).json({
        success: false,
        message: 'Asset, description, and priority are required',
      });
      return;
    }

    const request = await createMaintenanceRequest(req.auth, {
      assetId,
      description,
      priority,
      requestDate,
    });

    res.status(201).json({
      success: true,
      message: 'Maintenance request created successfully',
      data: request,
    });
  } catch (error) {
    if (error instanceof MaintenanceRequestError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
      return;
    }

    if (isPrismaForeignKeyError(error)) {
      res.status(401).json({
        success: false,
        message: 'Your session is invalid. Please log in again.',
      });
      return;
    }

    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to create maintenance request',
    });
  }
}

export async function patchApproveRequest(req: Request, res: Response) {
  try {
    if (!req.auth) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const id = parseRequestId(decodeURIComponent(String(req.params.id)));
    const request = await approveMaintenanceRequest(id, req.auth);

    res.status(200).json({
      success: true,
      message: 'Request approved successfully',
      data: request,
    });
  } catch (error) {
    if (error instanceof MaintenanceRequestError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
      return;
    }

    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to approve request',
    });
  }
}

export async function patchAssignRequest(req: Request, res: Response) {
  try {
    if (!req.auth) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const id = parseRequestId(decodeURIComponent(String(req.params.id)));
    const { technicianId } = req.body as { technicianId?: string | null };

    const request = await assignMaintenanceRequest(id, technicianId ?? null, req.auth);

    res.status(200).json({
      success: true,
      message: technicianId?.trim()
        ? 'Request assigned successfully'
        : 'Request unassigned successfully',
      data: request,
    });
  } catch (error) {
    if (error instanceof MaintenanceRequestError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
      return;
    }

    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to assign request',
    });
  }
}

export async function deleteRequest(req: Request, res: Response) {
  try {
    if (!req.auth) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const id = parseRequestId(decodeURIComponent(String(req.params.id)));
    const result = await deleteMaintenanceRequest(id, req.auth);

    res.status(200).json({
      success: true,
      message: 'Request rejected successfully',
      data: result,
    });
  } catch (error) {
    if (error instanceof MaintenanceRequestError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
      return;
    }

    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to reject request',
    });
  }
}

export async function patchProgressRequest(req: Request, res: Response) {
  try {
    if (!req.auth) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const id = parseRequestId(decodeURIComponent(String(req.params.id)));
    const request = await updateMaintenanceRequestProgress(id, req.auth);

    res.status(200).json({
      success: true,
      message: 'Request updated to in progress',
      data: request,
    });
  } catch (error) {
    if (error instanceof MaintenanceRequestError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
      return;
    }

    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to update request',
    });
  }
}

export async function patchCompleteRequest(req: Request, res: Response) {
  try {
    if (!req.auth) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const id = parseRequestId(decodeURIComponent(String(req.params.id)));
    const request = await completeMaintenanceRequest(id, req.auth, req.body);

    res.status(200).json({
      success: true,
      message: 'Request completed successfully',
      data: request,
    });
  } catch (error) {
    if (error instanceof MaintenanceRequestError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
      return;
    }

    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to complete request',
    });
  }
}
