import express from 'express';
import productModel from '../models/product.model';
import product from '../types/product.type';

const ProductModel = new productModel();

//create product
export const create = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
) => {
    try {
        const product = await ProductModel.create({
            name: req.body.name,
            price: req.body.price,
        } as product);
        res.json({
            status: 'create product is done',
            data: { ...product },
        });
    } catch (error) {
        next(error);
    }
};
//get one
export const show = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
) => {
    try {
        const product = await ProductModel.show(
            parseInt(req.params.id as unknown as string, 10),
        );
        res.json({
            status: 'get the product is done',
            data: { ...product },
        });
    } catch (error) {
        next(error);
    }
};
//get all
export const index = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
) => {
    try {
        const products = await ProductModel.index();
        res.json({
            status: 'get the products is done',
            data: { ...products },
        });
    } catch (error) {
        next(error);
    }
};
