import express from 'express';
import * as controllers from '../../handlers/user.handler';
import checkToken from '../../middleware/auth.middleware';
const routes = express.Router();

// creating new user on the database
routes.post('/', controllers.create);

// sign in already exited user from the database + generate token to use throw the rest of the api
routes.post('/auth', controllers.auth);

// get all the users from the db (require a token from "/auth" route )
routes.get('/', checkToken, controllers.index);

// get specific user from the db (require a token from "/auth" route) (id of a user)
routes.get('/:id', checkToken, controllers.show);

// update user from the db (require a token from "/auth" route)+(id of a user)
routes.patch('/:id', checkToken, controllers.update);

// delete user from the db (require a token from "/auth" route)+(id of a user)
routes.delete('/:id', checkToken, controllers.deleteOne);

export default routes;
