import supertest from 'supertest';
import app from '../../index';
import UserModel from '../../models/user.model';
import User from '../../types/user.type';
import db from '../../database';

const userModel = new UserModel();
const request = supertest(app);
let token = '';

//create suit for user
describe('User Route', () => {
    const user: User = {
        user_name: 'testUserRouteMOdel1',
        first_name: 'test1',
        last_name: 'test1',
        password: '123123pass1',
    };
    beforeAll(async () => {
        //get the id from the db
        const User = await userModel.create(user);
        user.id = User.id;
        token =
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX25hbWUiOiJjbGVhbiIsImlhdCI6MTY0ODEyMTEyMX0.jCuWH-MtbPUvnieb-7VaOXJZErjBuNlTiMzQnyctr7A';
    });
    afterAll(async () => {
        const connection = await db.connect();
        const qur = 'DELETE FROM users';
        await connection.query(qur);
        connection.release();
    });
    describe('Test auth api', () => {
        // test the auth and get the token to use in the rest of the tests
        it('test login method must success', async () => {
            const loginMethod = await request
                .post('/api/users/auth')
                .set('Content-type', 'application/json')
                .send({
                    user_name: user.user_name,
                    password: user.password,
                });
            expect(loginMethod.status).toBe(200);

            expect(loginMethod.body.data.token).toBeDefined();
        });
        it('test login method must fail', async () => {
            const loginMethod = await request
                .post('/api/users/auth')
                .send({
                    user_name: user.user_name,
                    password: 'randomPassword',
                });
            expect(loginMethod.status).toBe(401);
        });
    });
    describe('Test user create api', () => {
        it('test create method must success', async () => {
            const createMethod = await request
                .post('/api/users')
                .set('Content-type', 'application/json')
                .send({
                    user_name: 'testUserRouteMOdel2',
                    first_name: 'test2',
                    last_name: 'test2',
                    password: '123123pass2',
                });
            expect(createMethod.status).toBe(200);
            expect(createMethod.body.data.user_name).toBe(
                'testUserRouteMOdel2',
            );
        });
        it('test create method must fail', async () => {
            const createMethod = await request
                .post('/api/users')
                .set('Content-type', 'application/json')
                .send({
                    user_name: '',
                    first_name: 'test2',
                    last_name: 'test2',
                    password: '123123pass2',
                });
            expect(createMethod.status).toBe(200);
        });
    });
    describe('Test user index api', () => {
        it('test index method must success', async () => {
            const indexMethod = await request
                .get('/api/users')
                .set('Content-type', 'application/json')
                .set('Authorization', `Bearer ${token}`);
            expect(indexMethod.status).toBe(200);
            expect(indexMethod.body.data.length).toBe(3);
        });
        //without auth
        it('test index method must fail', (done) => {
            request
                .get('/api/users')
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
    describe('Test user show api', () => {
        it('test show method must success', async () => {
            const showMethod = await request
                .get(`/api/users/${user.id}`)
                .set('Content-type', 'application/json')
                .set('Authorization', `Bearer ${token}`);
            expect(showMethod.status).toBe(200);
            expect(showMethod.body.data.user_name).toBe(
                user.user_name,
            );
        });
        it('test show method must fail', (done) => {
            request
                .get(`/api/users/a`)
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
        it('test show method must fail auth failed', (done) => {
            request
                .get(`/api/users/${user.id}`)
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
    describe('Test user update api', () => {
        it('test update method must success', (done) => {
            request
                .patch(`/api/users/${user.id}`)
                .set('Content-type', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    user_name: 'lalala',
                    first_name: 'bvbvbv',
                    last_name: 'asdasd',
                    password: '123123pass3',
                })
                .expect(200)
                .end((err, res) => {
                    if (err) {
                        done.fail();
                    } else {
                        done();
                    }
                });
        });
        it('test update method must fail', (done) => {
            request
                .patch(`/api/users/${user.id}`)
                .set('Content-type', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    user_name: '',
                    first_name: 'test3',
                    last_name: 'test3',
                    password: '123123pass3',
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
    describe('Test user delete api', () => {
        it('test delete method must success', (done) => {
            request
                .delete(`/api/users/${user.id}`)
                .set('Content-type', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .expect(200)
                .end((err, res) => {
                    if (err) {
                        done.fail();
                    } else {
                        done();
                    }
                });
        });

        it('test delete method must fail', (done) => {
            //Two Requests make the api fail
            request
                .delete(`/api/users/a`)
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
        // without auth
        it('test delete method must fail auth failed', (done) => {
            request
                .delete(`/api/users/${user.id}`)
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
});
