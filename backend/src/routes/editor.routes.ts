import { Router } from 'express';
import multer from 'multer';
import { 
  saveContent,
  getContent,
  uploadMedia,
  getMediaList,
  deleteMedia
} from '../controllers/editor.controller';

const router = Router();
const upload = multer({ dest: 'uploads/' });

// Content management
router.post('/content', saveContent);
router.get('/content/:id', getContent);

// Media management
router.post('/media', upload.single('file'), uploadMedia);
router.get('/media', getMediaList);
router.delete('/media/:id', deleteMedia);

export default router;
