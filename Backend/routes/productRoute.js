import express from 'express';
import { createProduct, getProducts, getProductsByCategory, getProductById, updateProduct, deleteproduct } from '../controllers/productController.js';

const router = express.Router();


router.post('/', createProduct);
//router.get('/info', getProductsByCategory);
router.get('/', getProducts);

router.get('/:id', getProductById);

router.put('/:id', updateProduct);
router.delete('/:id', deleteproduct);

export default router;