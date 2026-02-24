'use strict'
import express, { response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { dbConnection } from './db.js';
import { corsOptions } from './cors-configuration.js';
import { helmetConfiguration } from './helmet-configuration.js';
import commentRoutes from '../src/comment/comment.routes.js';
import postRoutes from '../src/post/post.routes.js';

const BASE_PATH = '/api/v1';

const middlewares = (app) => {

    // irecibe los datos en formato json y el tamaño max es de 10MB
    app.use(express.urlencoded({ extended: false, limit: '10mb' }));
    app.use(express.json({ limit: '10mb' }));
    // controla quien puede hacer la peticion a la api
    app.use(cors(corsOptions));
    app.use(helmet(helmetConfiguration));
    app.use(morgan('dev'));
}

//rutas para conectar los enpoint
const routes = (app) => {

    app.use(`${BASE_PATH}/comment`, commentRoutes);
    app.use(`${BASE_PATH}/post`, postRoutes);



    //endpoint para ver si el servidor esta funcionando
    app.get(`${BASE_PATH}/Health`, (request, response) => {
        response.status(200).json({
            status: 'Healthy',
            timestamp: new Date().toISOString(),
            service: 'Gestor de Opiniones API'
        })
    })

    app.use((req, res) => {
        res.status(404).json({
            succes: false,
            message: 'Endpoint no encontrado'
        })
    })
}

//arranca nuestro servidor 
export const initServer = async () => {
    const app = express();
    //traemos el puerto desde variables de entorno
    const PORT = process.env.PORT;
    app.set('trust proxy', 1);

    try {
        //espera que la db se conecte y si llega a fallar no arranca el servidor
        await dbConnection();
        middlewares(app);
        routes(app);

        app.listen(PORT, () => {

            //mostramos en que puerto se levanta nuestro servidor
            console.log(`Gestor de Opiniones Admin Server running on port ${PORT}`);
            console.log(`Health check: http://localhost:${PORT}${BASE_PATH}/health`);
        })
    } catch (error) {
        console.error(`Error starting Admin Server: ${error.message}`);
        process.exit(1);
    }
}