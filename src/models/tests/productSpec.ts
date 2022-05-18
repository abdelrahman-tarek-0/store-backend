import productModel from '../product.model';
import db from '../../database/index';
import product from '../../types/product.type';

const ProductModel = new productModel();

describe('check for product defines', () => {
    it('Index Should be defined', () => {
        expect(ProductModel.index).toBeDefined();
    });
    it('Show Should be defined', () => {
        expect(ProductModel.show).toBeDefined();
    });
    it('Create Should be defined', () => {
        expect(ProductModel.create).toBeDefined();
    });
});
describe('Test product model', () => {
    const product: product = {
        name: 'testProductMOdel1',
        price: 12,
    };
    beforeAll(async () => {
        //get the id from the db
        const Product = await ProductModel.create(product);
        product.id = Product.id;
    });
    afterAll(async () => {
        const connection = await db.connect();
        const qur = 'DELETE FROM products';
        await connection.query(qur);
        connection.release();
    });
    it('test create method must success', async () => {
        const createProductMethod = await ProductModel.create({
            name: 'testProductMOdel2',
            price: 122,
        });
        expect(createProductMethod).toEqual({
            id: createProductMethod.id,
            name: 'testProductMOdel2',
            price: 122,
        });
    });
    it('test create method must fail', async () => {
        const createProductMethod = await ProductModel.create({
            name: 'testProductMOdel23',
            price: 122,
        });
        expect(createProductMethod).not.toEqual({
            id: createProductMethod.id,
            name: 'random',
            price: 122,
        });
    });
    it('test index method must success', async () => {
        const getAllProductMethod =
            (await ProductModel.index()) as unknown as Array<string>;
        expect(getAllProductMethod.length).toBe(3);
    });
    it('test index method must fail', async () => {
        const getAllProductMethod =
            (await ProductModel.index()) as unknown as Array<string>;
        expect(getAllProductMethod.length).not.toBe(0);
    });
    it('test show method must success', async () => {
        const showProductMethod = await ProductModel.show(
            product.id as number,
        );
        expect(showProductMethod).toEqual({
            id: product.id,
            name: product.name,
            price: product.price,
        } as product);
    });
    it('test show method must fail', async () => {
        const showProductMethod = await ProductModel.show(
            product.id as number,
        );
        expect(showProductMethod).not.toEqual({
            id: product.id,
            name: product.name,
            price: 0,
        } as product);
    });
});
