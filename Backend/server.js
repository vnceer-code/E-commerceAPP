import express from 'express';
import dotenv from 'dotenv';
import authRoute from './routes/authRoute.js';
import productRoute from './routes/productRoute.js';
import orderRoute from './routes/orderRoute.js';
import connectDB from './db/connectDB.js';
import { protect , authorize} from './middlewares/authMiddleware.js';
import dns from "node:dns/promises";
dns.setServers(["1.1.1.1"]);

dotenv.config();
const app = express();
app.use(express.json());
app.use('/auth', authRoute);
app.use('/products', productRoute);
app.use('/orders', orderRoute);
app.get('/profile', protect, (req, res) => {
    res.status(200).json({ message: 'This is a protected route', user: req.user });
});
app.get('/product',protect, authorize , (req, res) => {
    res.status(200).json({ message: 'This is an product route', user: req.user });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

connectDB();