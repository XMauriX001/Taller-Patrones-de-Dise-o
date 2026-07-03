import { Router } from 'express';
import { indexPosts, showPost, storePost, updatePost, deletePost } from '../controllers/post.controller';

const router = Router();

router.get('/posts', indexPosts);
router.get('/posts/:id', showPost);
router.post('/posts', storePost);
router.put('/posts/:id', updatePost);
router.patch('/posts/:id', updatePost);
router.delete('/posts/:id', deletePost);

export default router;
