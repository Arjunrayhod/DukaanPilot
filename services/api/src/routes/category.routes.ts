import { Router } from 'express';
import { CategoryController } from '../controllers/category.controller';
import { optionalAuth } from '../middleware/auth';

const router = Router();

router.get('/', CategoryController.list);
router.post('/', optionalAuth, CategoryController.create);

export const categoryRoutes = router;
