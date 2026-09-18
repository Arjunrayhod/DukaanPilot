import { Router } from 'express';
import { ProductController } from '../controllers/product.controller';
import { optionalAuth } from '../middleware/auth';

const router = Router();

router.get('/', ProductController.list);
router.get('/barcode/:barcode', ProductController.getByBarcode);
router.get('/:id', ProductController.getById);
router.post('/', optionalAuth, ProductController.create);
router.put('/:id', optionalAuth, ProductController.update);
router.delete('/:id', optionalAuth, ProductController.delete);

export const productRoutes = router;
