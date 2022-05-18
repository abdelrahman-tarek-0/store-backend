import express from 'express';
import * as controllers from '../../handlers/product.handler';
import checkToken from '../../middleware/auth.middleware';
const routes = express.Router();

// create a product  (require a token from "/auth" route )
routes.post('/', checkToken, controllers.create);

// get all the products from the database
routes.get('/', controllers.index);

// get specific product from the db (id of a product)
routes.get('/:id', controllers.show);

export default routes;
