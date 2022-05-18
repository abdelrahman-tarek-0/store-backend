import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import error_handler_middleware from './middleware/error.middleware';
import config from './config';
import routes from './routes';

const app = express();
const port = config.port || 3000;

app.use(morgan('common'));
app.use(helmet());
app.use(express.json());

// api routes user,products,orders
app.use('/api', routes);

//main route
app.get('/', (_req, res) => {
    res.send('main page');
});

//error handling
app.use(error_handler_middleware);
app.use((_req, res) => {
    res.status(404).json({
        message: 'API route not found',
    });
});

//listening
app.listen(port, () => {
    console.log(`server is listening on port ${port}`);
});
export default app;
