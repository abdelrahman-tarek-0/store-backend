import UserModel from '../user.model';
import db from '../../database/index';
import User from '../../types/user.type';
const userModel = new UserModel();

describe("check for user defines",()=>{
    it("Index Should be defined",()=>{
        expect(userModel.index).toBeDefined();
    })
    it("Show Should be defined",()=>{
        expect(userModel.show).toBeDefined();
    })
    it("Create Should be defined",()=>{
        expect(userModel.create).toBeDefined();
    })
    it("update Should be defined",()=>{
        expect(userModel.update).toBeDefined();
    })
    it("auth Should be defined",()=>{
        expect(userModel.auth).toBeDefined();
    })
    it("delete Should be defined",()=>{
        expect(userModel.delete).toBeDefined();
    })
})
describe('Test user model', () => {
    const user: User = {
        user_name: 'testUserMOdel1',
        first_name: 'test1',
        last_name: 'test1',
        password: '123123pass1',
    };
    beforeAll(async () => {
        //get the id from the db
        const User = await userModel.create(user);
        user.id = User.id;
    });
    afterAll(async () => {
        const connection = await db.connect();
        const qur = 'DELETE FROM users';
        await connection.query(qur);
        connection.release();
    });
    it('test create method must success', async () => {
        const createUserMethod = await userModel.create({
            user_name: 'testUserMOdel2',
            first_name: 'test2',
            last_name: 'test2',
            password: '123123pass2',
        });
        expect(createUserMethod).toEqual({
            id: createUserMethod.id,
            user_name: 'testUserMOdel2',
            first_name: 'test2',
            last_name: 'test2',
            password: createUserMethod.password,
        });
    });
    it('test create method must fail', async () => {
        const createUserMethod = await userModel.create({
            user_name: 'testUserMOdel555',
            first_name: 'test2',
            last_name: 'test2',
            password: '123123pass2',
        });
        expect(createUserMethod).not.toEqual({
            id: createUserMethod.id,
            user_name: 'randomText',
            first_name: 'test2',
            last_name: 'test2',
            password: createUserMethod.password,
        });
    });
    it('test index method must success', async () => {
        const getAllUserMethod =
            (await userModel.index()) as unknown as Array<string>;
        expect(getAllUserMethod.length).toBe(3);
    });
    it('test index method must fail', async () => {
        const getAllUserMethod =
            (await userModel.index()) as unknown as Array<string>;
        expect(getAllUserMethod.length).not.toBe(0);
    });
    it('test show method must success', async () => {
        const showUserMethod = await userModel.show(
            user.id as number,
        );
        expect(showUserMethod).toEqual({
            id: user.id,
            user_name: user.user_name,
            first_name: user.first_name,
            last_name: user.last_name,
        } as User);
    });
    it('test show method  must fail', async () => {
        const showUserMethod = await userModel.show(
            user.id as number,
        );
        expect(showUserMethod).not.toEqual({
            id: user.id,
            user_name: user.user_name,
            first_name: 'random',
            last_name: user.last_name,
        } as User);
    });
    it('test auth method must success', async () => {
        const UserMethod = await userModel.auth(
            user.user_name,
            user.password,
        );
        expect(UserMethod?.user_name).toEqual('testUserMOdel1');
        expect(UserMethod?.first_name).toEqual('test1');
        expect(UserMethod?.last_name).toEqual('test1');
    });
    it('test auth method must fail', async () => {
        const UserMethod = await userModel.auth(
            user.user_name,
            user.password,
        );
        expect(UserMethod?.user_name).not.toEqual('random');
        expect(UserMethod?.first_name).not.toEqual('random');
        expect(UserMethod?.last_name).not.toEqual('random');
    });
    it('test auth method must return null', async () => {
        const UserMethod = await userModel.auth(
            'random',
            user.password,
        );
        expect(UserMethod).toEqual(null);
    });
    it('test update method', async () => {
        const updateUser = {
            user_name: 'tesght',
            first_name: 'teghgst',
            last_name: 'testghg',
            password: '1515ghg1',
        };
        const id = user.id as number;
        const updateUserMethod = await userModel.update(
            updateUser,
            id,
        );
        expect({
            user_name: updateUser.user_name,
            first_name: updateUser.first_name,
            last_name: updateUser.last_name,
        }).toEqual({
            user_name: updateUserMethod.user_name,
            first_name: updateUserMethod.first_name,
            last_name: updateUserMethod.last_name,
        });
    });

    it('test delete method', async () => {
        const id = user.id as number;
        const deleteUserMethod = await userModel.delete(id);
        expect(deleteUserMethod.id).toEqual(id);
    });
});
