import orderModel from '../models/orderModel.js';
import productModel from '../models/productModel.js';

// Create a new order
export const createOrder = async (req, res) => {
    try {
        const { products, shippingAddress } = req.body;
        const userId = req.user.id; // Assuming user is set by auth middleware

        if (!products || products.length === 0) {
            return res.status(400).json({ message: 'No products provided' });
        }
        console.log(products);

        let totalAmount = 0;
        const orderProducts = [];

        for (const item of products) {
            const product = await productModel.findById(item.productId);
            if (!product) {
                return res.status(404).json({ message: `Product ${item.productId} not found` });
            }
            const quantity = item.quantity || 1;
            const price = product.price * quantity;
            totalAmount += price;

            orderProducts.push({
                product: item.productId,
                quantity,
                price
            });
        }

        const order = await orderModel.create({
            user: userId,
            products: orderProducts,
            totalAmount,
            shippingAddress
        });

        res.status(201).json({ message: "Order created successfully", order });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all orders (admin) or user's orders
export const getOrders = async (req, res) => {
    try {
        const userId = req.user.id;
        const userRole = req.user.role;

        let query = {};
        if (userRole !== 'admin') {
            query.user = userId;
        }

        const orders = await orderModel.find(query).populate('user', 'username email').populate('products.product', 'name price');
        res.json({ message: "Orders found", orders });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get order by ID
export const getOrderById = async (req, res) => {
    try {
        const orderId = req.params.id;
        const userId = req.user.id;
        const userRole = req.user.role;

        const order = await orderModel.findById(orderId).populate('user', 'username email').populate('products.product', 'name price');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Check if user owns the order or is admin
        if (order.user._id.toString() !== userId && userRole !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }

        res.json({ message: "Order found", order });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update order (mainly status for admin)
export const updateOrder = async (req, res) => {
    try {
        const orderId = req.params.id;
        const userId = req.user.id;
        const userRole = req.user.role;
        const { status, shippingAddress } = req.body;

        const order = await orderModel.findById(orderId);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Only admin can update status, user can update shipping address if pending
        if (userRole === 'admin') {
            if (status) order.status = status;
        } else if (order.user.toString() === userId && order.status === 'pending') {
            if (shippingAddress) order.shippingAddress = shippingAddress;
        } else {
            return res.status(403).json({ message: 'Access denied' });
        }

        await order.save();
        res.json({ message: "Order updated successfully", order });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete order (only if pending)
export const deleteOrder = async (req, res) => {
    try {
        const orderId = req.params.id;
        const userId = req.user.id;
        const userRole = req.user.role;

        const order = await orderModel.findById(orderId);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Only allow deletion if user owns the order and status is pending, or admin
        if ((order.user.toString() === userId && order.status === 'pending') || userRole === 'admin') {
            await orderModel.findByIdAndDelete(orderId);
            res.json({ message: "Order deleted successfully" });
        } else {
            return res.status(403).json({ message: 'Cannot delete this order' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};