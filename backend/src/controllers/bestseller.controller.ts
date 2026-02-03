import type { Request, Response, NextFunction } from 'express';
import { bestsellerService } from '../services/bestseller.service.js';

export const bestsellerController = {
    /**
     * GET /v1/bestsellers
     */
    list: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const limitParam = req.query['limit'];
            const limit = limitParam ? Number(limitParam) : undefined;
            const result = await bestsellerService.listPublic(limit);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    },
};
