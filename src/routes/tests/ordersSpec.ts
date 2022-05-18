import supertest from 'supertest';
import app from '../../index';
import UserModel from '../../models/user.model';
import productModel from '../../models/product.model';
import orderModel from '../../models/order.model';
import User from '../../types/user.type';
import Product from '../../types/product.type';
import Order from '../../types/order.type';
import db from '../../database';

const OrderModel = new orderModel();
const ProductModel = new productModel();
const userModel = new UserModel();
const request = supertest(app);
const token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX25hbWUiOiJjbGVhbiIsImlhdCI6MTY0ODEyMTEyMX0.jCuWH-MtbPUvnieb-7VaOXJZErjBuNlTiMzQnyctr7A';
describe('Test order model', () => {
    const order: Order = {
        status: 'pending',
        user_id: 0,
    };
    const user: User = {
        user_name: 'testOrderRouteUser',
        first_name: 'test',
        last_name: 'test',
        password: '123123pass',
    };
    const product: Product = {
        name: 'testOrderRouteProduct',
        price: 12,
    };
    beforeAll(async () => {
        const Product = await ProductModel.create(product);
        product.id = Product.id;
        const User = await userModel.create(user);
        user.id = User.id;
        order.user_id = User.id as number;
        const Order = await OrderModel.create(order);
        order.id = Order.id;
    });
    afterAll(async () => {
        const connection = await db.connect();
        const qur1 = 'DELETE FROM order_products';
        const qur2 = 'DELETE FROM orders';
        const qur3 = 'DELETE FROM products';
        const qur4 = 'DELETE FROM users';
        await connection.query(qur1);
        await connection.query(qur2);
        await connection.query(qur3);
        await connection.query(qur4);
        connection.release();
    });

    describe(',Test order create api', () => {
        it(',test create method must success', async () => {
            const createMethod = await request
                .post(`/api/orders/create/${user.id}`)
                .set('Content-type', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    status: 'pending',
                });
            expect(createMethod.status).toBe(200);
            expect(createMethod.body.data.status).toBe('pending');
        });
        it(',test create method must fail', (done) => {
            request
                .post('/api/orders/create/a')
                .set('Content-type', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    status: 'pending',
                })
                .expect(500)
                .end((err, res) => {
                    if (err) {
                        done.fail();
                    } else {
                        done();
                    }
                });
        });
    });
    describe(',test adding product to order', () => {
        it(',test adding product to order must success', async () => {
            const createMethod = await request
                .post(`/api/orders/add-product/${order.id}`)
                .set('Content-type', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    quantity: 1,
                    product_id: product.id,
                });
            expect(createMethod.status).toBe(200);
            expect(createMethod.body.data.quantity).toBe(1);
        });
        it(',test adding product to order must fail', (done) => {
            request
                .post(`/api/orders/add-product/a`)
                .set('Content-type', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    quantity: 1,
                    product_id: product.id,
                })
                .expect(500)
                .end((err, res) => {
                    if (err) {
                        done.fail();
                    } else {
                        done();
                    }
                });
        });
    });
    //get all the product in the order
    describe(',test get all the product in the order', () => {
        it(',test get all the product in the order must success', async () => {
            const createMethod = await request
                .get(`/api/orders/check-products/${order.id}`)
                .set('Content-type', 'application/json')
                .set('Authorization', `Bearer ${token}`);
            expect(createMethod.status).toBe(200);
            expect(createMethod.body.data.length).toBe(1);
        });
        it(',test get all the product in the order must fail', (done) => {
            request
                .get(`/api/orders/check-products/a`)
                .set('Content-type', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .expect(500)
                .end((err, res) => {
                    if (err) {
                        done.fail();
                    } else {
                        done();
                    }
                });
        });
        it(',test get all the product in the order must fail auth fail', (done) => {
            request
                .get(`/api/orders/check-products/a`)
                .set('Content-type', 'application/json')
                .expect(500)
                .end((err, res) => {
                    if (err) {
                        done.fail();
                    } else {
                        done();
                    }
                });
        });
    });
    //get all the orders done by user
    describe(',test get all the orders done by user', () => {
        it(',test get all the orders done by user must success', async () => {
            const createMethod = await request
                .get(`/api/orders/check-orders/${user.id}`)
                .set('Content-type', 'application/json')
                .set('Authorization', `Bearer ${token}`);
            expect(createMethod.status).toBe(200);
            expect(createMethod.body.data.length).toBe(2);
        });
        it(',test get all the orders done by user must fail', (done) => {
            request
                .get(`/api/orders/check-orders/a`)
                .set('Content-type', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .expect(500)
                .end((err, res) => {
                    if (err) {
                        done.fail();
                    } else {
                        done();
                    }
                });
        });
    });
});
