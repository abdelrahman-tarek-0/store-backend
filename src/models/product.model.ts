import product from '../types/product.type';
import db from '../database';

class productModel {
    //create product
    async create(p: product): Promise<product> {
        try {
            const connection = await db.connect();
            const qur = `INSERT INTO products (name,price) VALUES ($1, $2) returning *`;
            const product = await connection.query(qur, [
                p.name, // unique name
                p.price,
            ]);
            connection.release();
            return product.rows[0];
        } catch (error) {
            throw new Error('error with product creation');
        }
    }
    //get one product
    async show(id: number): Promise<product> {
        try {
            const connection = await db.connect();
            const qur = `SELECT * FROM products WHERE id = $1`;
            const product = await connection.query(qur, [id]);
            connection.release();
            return product.rows[0];
        } catch (error) {
            throw new Error('error with product get one');
        }
    }
    //get all the products
    async index(): Promise<product> {
        try {
            const connection = await db.connect();
            const qur = `SELECT * FROM products`;
            const product = await connection.query(qur);
            connection.release();
            return product.rows as unknown as product;
        } catch (error) {
            throw new Error('error with product get all');
        }
    }
}
export default productModel;
