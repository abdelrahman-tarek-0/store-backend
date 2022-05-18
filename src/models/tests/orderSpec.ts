import order from '../../types/order.type';
import order_product from '../../types/orderProduct.type';
import product from '../../types/product.type';
import User from '../../types/user.type';
import orderModel from '../order.model';
import UserModel from '../user.model';
import productModel from '../product.model';
import db from '../../database/index';

const OrderModel = new orderModel();
const ProductModel = new productModel();
const userModel = new UserModel();

describe('check for orders defines',()=>{
    it('create Should be defined',()=>{
        expect(OrderModel.create).toBeDefined();
    });
    it('addProduct Should be defined',()=>{
        expect(OrderModel.addProduct).toBeDefined();
    });
    it('productsInOrder Should be defined',()=>{
        expect(OrderModel.productsInOrder).toBeDefined();
    });
    it('ordersUserMade Should be defined',()=>{
        expect(OrderModel.ordersUserMade).toBeDefined();
    });
})
    
    
describe('Test order model', () => {
    const order: order = {
        status: 'pending',
        user_id: 0,
    };
    const user: User = {
        user_name: 'testOrderModelUser',
        first_name: 'test',
        last_name: 'test',
        password: '123123pass',
    };
    const product: product = {
        name: 'testOrderModelProduct',
        price: 12,
    };
    beforeAll(async () => {
        const Product = await ProductModel.create(product);
        product.id = Product.id;
        const User = await userModel.create(user);
        user.id = User?.id;
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
    //CREATE ORDER (cart)
    it('test create order method must success', async () => {
        const id = Number(user.id);
        const createOrderMethod = await OrderModel.create({
            status: 'done',
            user_id: id,
        } as order);
        expect(createOrderMethod).toEqual({
            id: createOrderMethod.id,
            status: 'done',
            user_id: createOrderMethod.user_id,
        } as order);
    });
    it('test create order method must fail', async () => {
        const id = Number(user.id);
        const createOrderMethod = await OrderModel.create({
            status: 'done',
            user_id: id,
        } as order);
        expect(createOrderMethod).not.toEqual({
            id: createOrderMethod.id,
            status: 'randomText',
            user_id: createOrderMethod.user_id,
        } as order);
    });
    //add add to the order
    it('test adding product to order must success', async () => {
        const addProductOrderMethod = await OrderModel.addProduct({
            order_id: order.id,
            product_id: product.id,
            quantity: 10,
        } as order_product);
        expect(addProductOrderMethod).toEqual({
            id: addProductOrderMethod.id,
            order_id: order.id,
            product_id: product.id,
            quantity: 10,
        } as order_product);
    });
    it('test adding product to order must fail', async () => {
        const addProductOrderMethod = await OrderModel.addProduct({
            order_id: order.id,
            product_id: product.id,
            quantity: 10,
        } as order_product);
        expect(addProductOrderMethod).not.toEqual({
            id: addProductOrderMethod.id,
            order_id: 2222,
            product_id: product.id,
            quantity: 10,
        } as order_product);
    });
    // get all the product in the order
    it('test getting all the product in the order must success', async () => {
        const gettingAllProductOrderMethod =
            (await OrderModel.productsInOrder({
                order_id: order.id,
            } as order_product)) as unknown as Array<string>;
        expect(gettingAllProductOrderMethod.length).toEqual(2);
    });
    it('test getting all the product in the order must fail', async () => {
        const gettingAllProductOrderMethod =
            (await OrderModel.productsInOrder({
                order_id: order.id,
            } as order_product)) as unknown as Array<string>;
        expect(gettingAllProductOrderMethod.length).not.toEqual(0);
    });
    // get all the orders user made
    it('test getting all the order user had make must success', async () => {
        const gettingAllOrderMethod =
            (await OrderModel.ordersUserMade({
                user_id: user.id,
            } as order)) as unknown as Array<string>;
        expect(gettingAllOrderMethod.length).toEqual(3);
    });
    it('test getting all the order user had make must fail', async () => {
        const gettingAllOrderMethod =
            (await OrderModel.ordersUserMade({
                user_id: user.id,
            } as order)) as unknown as Array<string>;
        expect(gettingAllOrderMethod.length).not.toEqual(0);
    });
});
