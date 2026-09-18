import { Router } from 'express';
import { InventoryController } from '../controllers/inventory.controller';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.get('/alerts', InventoryController.getLowStockAlerts);
router.get('/movements', InventoryController.getMovements);
router.post('/adjust', requireAuth, InventoryController.adjust);

export const inventoryRoutes = router;
