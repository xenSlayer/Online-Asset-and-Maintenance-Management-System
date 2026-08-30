import { Request, Response } from 'express';
import {
  AssetError,
  createAsset,
  getAssetById,
  listAssets,
  parseAssetId,
  updateAsset,
} from '../services/assetService';

export async function getAssets(req: Request, res: Response) {
  try {
    const assets = await listAssets();

    res.status(200).json({
      success: true,
      data: assets,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to load assets',
    });
  }
}

export async function getAsset(req: Request, res: Response) {
  try {
    const id = parseAssetId(String(req.params.id));
    const asset = await getAssetById(id);

    res.status(200).json({
      success: true,
      data: asset,
    });
  } catch (error) {
    if (error instanceof AssetError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
      return;
    }

    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to load asset',
    });
  }
}

export async function postAsset(req: Request, res: Response) {
  try {
    const { name, category, location, purchaseDate, status } = req.body;

    if (!name || !category || !location || !purchaseDate || !status) {
      res.status(400).json({
        success: false,
        message: 'Name, category, location, purchase date, and status are required',
      });
      return;
    }

    const asset = await createAsset({
      name,
      category,
      serialNo: req.body.serialNo,
      description: req.body.description,
      location,
      purchaseDate,
      status,
      assignedTo: req.body.assignedTo,
    });

    res.status(201).json({
      success: true,
      message: 'Asset created successfully',
      data: asset,
    });
  } catch (error) {
    if (error instanceof AssetError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
      return;
    }

    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to create asset',
    });
  }
}

export async function putAsset(req: Request, res: Response) {
  try {
    const id = parseAssetId(String(req.params.id));
    const asset = await updateAsset(id, req.body);

    res.status(200).json({
      success: true,
      message: 'Asset updated successfully',
      data: asset,
    });
  } catch (error) {
    if (error instanceof AssetError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
      return;
    }

    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to update asset',
    });
  }
}
