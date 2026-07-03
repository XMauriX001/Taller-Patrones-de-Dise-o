import { Router } from 'express';
import healthRoutes from './health.routes';
import postRoutes from './post.routes';

const router = Router();

router.use('/', healthRoutes);
router.use('/', postRoutes);

export default router;
