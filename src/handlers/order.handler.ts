import express from 'express';
import orderModel from '../models/order.model';
import order from '../types/order.type';
import order_product from '../types/orderProduct.type';

const OrderModel = new orderModel();

//CREATE ORDER (cart)
export const create = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
) => {
    try {
        const order = await OrderModel.create({
            status: req.body.status,
            user_id: parseInt(req.params.id, 10),
        } as order);
        res.json({
            status: 'order created',
            data: order,
        });
    } catch (error) {
        next(error);
    }
};

//add product to this order
export const addProduct = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
) => {
    try {
        const product = await OrderModel.addProduct({
            order_id: parseInt(req.params.id, 10),
            product_id: parseInt(req.body.product_id, 10),
            quantity: parseInt(req.body.quantity, 10),
        } as order_product);
        res.json({
            status: 'product added to the order',
            data: product,
        });
    } catch (error) {
        next(error);
    }
};
// get all the products in the order
export const productsInOrder = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
) => {
    try {
        const productsInOrder = await OrderModel.productsInOrder({
            order_id: parseInt(req.params.id, 10),
        } as order_product);
        res.json({
            status: 'get all product in the order',
            data: productsInOrder,
        });
    } catch (error) {
        next(error);
    }
};
// get all the orders user made
export const ordersUserMade = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
) => {
    try {
        const ordersUserMade = await OrderModel.ordersUserMade({
            user_id: parseInt(req.params.id, 10),
        } as order);
        res.json({
            status: 'get all orders the user made is done',
            data: ordersUserMade,
        });
    } catch (error) {
        next(error);
    }
};
