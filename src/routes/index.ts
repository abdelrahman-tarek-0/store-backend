import express from 'express';
import userRoutes from './api/users.routes';
import productRoutes from './api/products.routes';
import orderRoutes from './api/orders.routes';
const routes = express.Router();

// main api rout
routes.get('/', (req, res) => {
    res.send('main api route');
});
//users rout
routes.use('/users', userRoutes);
//products rout
routes.use('/products', productRoutes);
//orders rout
routes.use('/orders', orderRoutes);

export default routes;
