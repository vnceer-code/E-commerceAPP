import express from 'express';
import { createOrder, getOrders, getOrderById, updateOrder, deleteOrder } from '../controllers/orderController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

// All order routes require authentication
router.use(protect);

// Create a new order
router.post('/', createOrder);

// Get all orders (user's orders or all if admin)
router.get('/', getOrders);

// Get order by ID
router.get('/:id', getOrderById);

// Update order
router.put('/:id', updateOrder);

// Delete order
router.delete('/:id', deleteOrder);

export default router;