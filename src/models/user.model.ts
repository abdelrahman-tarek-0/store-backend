import db from '../database';
import User from '../types/user.type';
import bcrypt from 'bcrypt';
import config from '../config';

// hash function to hash the password
export const hash = (password: string) => {
    const salt = parseInt(config.SALT_ROUNDS as string, 10);
    return bcrypt.hashSync(`${password}${config.BCRYPT_PASS}`, salt);
};


class UserModel {
    // create new user
    async create(us: User): Promise<User> {
        try {
            const connection = await db.connect();
            const qur = `INSERT INTO users (user_name,first_name,last_name,password)
             VALUES ($1, $2, $3, $4) returning *`;
            const result = await connection.query(qur, [
                us.user_name, //take a unique user name
                us.first_name,
                us.last_name,
                hash(us.password), //hash the password before saving in the db
            ]);
            connection.release();
            return result.rows[0];
        } catch (error) {
            throw new Error(
                `error happened can not create (${us.user_name}): ${
                    (error as Error).message
                } `,
            );
        }
    }
    // get the all users
    async index(): Promise<User> {
        try {
            const connection = await db.connect();
            const qur =
                'SELECT id,user_name,first_name,last_name FROM users';
            const result = await connection.query(qur);
            connection.release();
            return result.rows as unknown as User;
        } catch (error) {
            throw new Error('error happened can not get all users');
        }
    }
    // get 1 user
    async show(id: number): Promise<User> {
        try {
            const connection = await db.connect();
            const qur =
                'SELECT id,user_name,first_name,last_name FROM users WHERE id = $1';
            const result = await connection.query(qur, [id]);
            connection.release();
            return result.rows[0];
        } catch (error) {
            throw new Error(
                `error happened can not get the user with id ${id}`,
            );
        }
    }
    //update the user
    async update(us: User, id: number): Promise<User> {
        try {
            const connection = await db.connect();
            const qur = `UPDATE users
                         SET 
                            user_name = ($1),
                            first_name = ($2),
                            last_name = ($3),
                            password = ($4)
                            WHERE id = ($5)
                        RETURNING id,user_name,first_name,last_name`;
            const result = await connection.query(qur, [
                us.user_name,
                us.first_name,
                us.last_name,
                hash(us.password),
                id,
            ]);
            connection.release();
            return result.rows[0];
        } catch (error) {
            throw new Error(
                `err happened ${error},, where id is ${id}`,
            );
        }
    }
    //delete a user
    async delete(id: number): Promise<User> {
        try {
            const connection = await db.connect();
            const qur = `DELETE FROM users WHERE id = $1
                         RETURNING id,user_name,first_name,last_name`;
            const result = await connection.query(qur, [id]);
            connection.release();
            return result.rows[0];
        } catch (error) {
            throw new Error(
                `error happened can not delete the user with id ${id}`,
            );
        }
    }
    //sign in
    async auth(
        user_name: string,
        unHashedPassword: string,
    ): Promise<User | null> {
        try {
            const connection = await db.connect();
            const qur = `SELECT id,user_name,first_name,last_name,password FROM users WHERE user_name = $1`;
            const result = await connection.query(qur, [user_name]);
            if (result.rows.length) {
                const hashedPassword = result.rows[0].password;
                const v = bcrypt.compareSync(
                    `${unHashedPassword + config.BCRYPT_PASS}`,
                    hashedPassword,
                );
                if (v) {
                    return result.rows[0];
                }
            }
            connection.release();
            return null;
        } catch (error) {
            throw new Error(
                `something went wrong with auth ${
                    (error as Error).message
                }`,
            );
        }
    }
}
export default UserModel;
