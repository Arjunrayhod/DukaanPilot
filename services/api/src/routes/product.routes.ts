import { Router } from 'express';
import { ProductController } from '../controllers/product.controller';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.get('/', ProductController.list);
router.get('/barcode/:barcode', ProductController.getByBarcode);
router.get('/:id', ProductController.getById);
router.post('/', requireAuth, ProductController.create);
router.put('/:id', requireAuth, ProductController.update);
router.delete('/:id', requireAuth, ProductController.delete);

export const productRoutes = router;
