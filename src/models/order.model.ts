import order_product from '../types/orderProduct.type';
import db from '../database';
import order from '../types/order.type';

class orderModel {
    //CREATE ORDER (cart)
    async create(order: order): Promise<order> {
        try {
            const connection = await db.connect();
            const qur = `INSERT INTO orders (status,user_id) VALUES ($1, $2) returning *`;
            const result = await connection.query(qur, [
                order.status,
                order.user_id,
            ]);

            connection.release();
            return result.rows[0];
        } catch (error) {
            throw new Error('error with creating the order');
        }
    }
    //add product to the order
    async addProduct(
        order_product: order_product,
    ): Promise<order_product> {
        try {
            const connection = await db.connect();
            const qur = `INSERT INTO order_products (order_id,product_id,quantity) VALUES ($1, $2, $3) returning *`;
            const result = await connection.query(qur, [
                order_product.order_id,
                order_product.product_id,
                order_product.quantity,
            ]);

            connection.release();
            return result.rows[0];
        } catch (error) {
            throw new Error(
                `error with adding product ${order_product.product_id} to order ${order_product.order_id} check if you created order or not`,
            );
        }
    }
    // get all the product in the order
    async productsInOrder(
        order_product: order_product,
    ): Promise<order_product> {
        try {
            const connection = await db.connect();
            const qur = `SELECT * FROM order_products WHERE order_id = $1`;
            const result = await connection.query(qur, [
                order_product.order_id,
            ]);
            connection.release();
            return result.rows as unknown as order_product;
        } catch (error) {
            throw new Error(
                `error with getting all the products in the order`,
            );
        }
    }
    // get all the orders user made
    async ordersUserMade(order: order): Promise<order_product> {
        try {
            const connection = await db.connect();
            const qur = `SELECT * FROM orders WHERE user_id = $1`;
            const result = await connection.query(qur, [
                order.user_id,
            ]);
            connection.release();
            return result.rows as unknown as order_product;
        } catch (error) {
            throw new Error(
                `error with getting all the products in the order`,
            );
        }
    }
}
export default orderModel;
