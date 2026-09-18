import { Router } from 'express';
import { healthRoutes } from './health.routes';
import { authRoutes } from './auth.routes';
import { productRoutes } from './product.routes';
import { inventoryRoutes } from './inventory.routes';
import { supplierRoutes } from './supplier.routes';
import { categoryRoutes } from './category.routes';

const router = Router();

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/inventory', inventoryRoutes);
router.use('/suppliers', supplierRoutes);
router.use('/categories', categoryRoutes);

export const apiRouter = router;
