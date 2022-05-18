import supertest from 'supertest';
import app from '../../index';
import UserModel from '../../models/user.model';
import productModel from '../../models/product.model';
import User from '../../types/user.type';
import Product from '../../types/product.type';
import db from '../../database';

const userModel = new UserModel();
const ProductModel = new productModel();
const request = supertest(app);
let token = '';

describe('Product Route', () => {
    const user: User = {
        user_name: 'testProductUserRouteMOdel1',
        first_name: 'test1',
        last_name: 'test1',
        password: '123123pass1',
    };
    const product: Product = {
        name: 'testProductRouteMOdel1',
        price: 200,
    };
    beforeAll(async () => {
        //get the id from the db
        const User = await userModel.create(user);
        user.id = User?.id;
        const Product = await ProductModel.create(product);
        product.id = Product.id;
    });
    afterAll(async () => {
        const connection = await db.connect();
        const qur1 = 'DELETE FROM users';
        const qur2 = 'DELETE FROM products';
        await connection.query(qur1);
        await connection.query(qur2);
        connection.release();
    });
    describe('get token for product api', () => {
        it('test getting the token', async () => {
            const loginMethod = await request
                .post('/api/users/auth')
                .set('Content-type', 'application/json')
                .send({
                    user_name: user.user_name,
                    password: user.password,
                });
            expect(loginMethod.status).toBe(200);
            token = loginMethod.body.data.token;
            expect(loginMethod.body.data.token).toBeDefined();
        });
    });
    describe('Test product create api', () => {
        it('test create method must success', async () => {
            const createMethod = await request
                .post('/api/products')
                .set('Content-type', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    name: 'testProductRouteMOdel2',
                    price: 100,
                });
            expect(createMethod.status).toBe(200);
            expect(createMethod.body.data.name).toBe(
                'testProductRouteMOdel2',
            );
        });
        it('test create method must fail', async () => {
            const createMethod = await request
                .post('/api/products')
                .set('Content-type', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    name: 'testProductRouteMOdel2',
                    price: 100,
                });
            expect(createMethod.status).toBe(500);
        });
        it('test create method must fail auth failed', (done) => {
            request
                .post('/api/products')
                .set('Contant-type', 'applictation/json')
                .send({
                    name: 'testProductRouteMOdel2',
                    price: 100,
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
    describe('Test product index api', () => {
        it('test index method must success', async () => {
            const indexMethod = await request
                .get('/api/products')
                .set('Content-type', 'application/json')
                .set('Authorization', `Bearer ${token}`);
            expect(indexMethod.status).toBe(200);
            expect(indexMethod.body.data[0].name).toEqual(
                'testProductRouteMOdel1',
            );
            expect(indexMethod.body.data[1].name).toEqual(
                'testProductRouteMOdel2',
            );
        });
    });
    describe('Test product show api', () => {
        it('test show method must success', async () => {
            const showMethod = await request
                .get('/api/products/' + product.id)
                .set('Content-type', 'application/json')
                .set('Authorization', `Bearer ${token}`);
            expect(showMethod.status).toBe(200);
            expect(showMethod.body.data.name).toEqual(
                'testProductRouteMOdel1',
            );
        });

        it('test show method must fail', (done) => {
            request
                .get('/api/products/a')
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
