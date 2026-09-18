import { Router } from 'express';
import { SupplierController } from '../controllers/supplier.controller';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.get('/', SupplierController.list);
router.get('/:id', SupplierController.getById);
router.post('/', requireAuth, SupplierController.create);

export const supplierRoutes = router;
