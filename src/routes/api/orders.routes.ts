import express from 'express';
import * as controllers from '../../handlers/order.handler';
import checkToken from '../../middleware/auth.middleware';
const routes = express.Router();

//create order for user (user id)
routes.post('/create/:id', checkToken, controllers.create);

//add product to the order created (order id)
routes.post('/add-product/:id', checkToken, controllers.addProduct);

//get all the product in the order (order id)
routes.get(
    '/check-products/:id',
    checkToken,
    controllers.productsInOrder,
);

//get all the orders done by user (user id)
routes.get(
    '/check-orders/:id',
    checkToken,
    controllers.ordersUserMade,
);

export default routes;
