import express from 'express';
import cors from 'cors';
import { Server as socketServer } from "socket.io";
import * as http from 'http'; //ES 6
import { socketController } from '../sockets/controller.js';

export class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        //Instanciamos el server para socket.io
        this.server = http.createServer(this.app);
        this.io = new socketServer(this.server);

        //Creamos un obj con las rutas
        this.paths = {}

        //Middlewares - Funciones que se ejecutan cuando levantamos nuestro servidor. Antes de realizar las peticiones a la base de datos o llamar a un controlador
        this.middlewares();

        //Rutas de la app
        this.routes();

        //Configuracion de sockets
        this.configuracionSockets();

    }

    //CONECTAR A BASE DE DATOS
    async conectarDB() {
        await dbConnection();
    }

    middlewares() {
        //CORS
        this.app.use(cors());

        //Directorio publico. Aca manejamos el index de la app, no es necesario una ruta que especifique el index dentro de routes()
        this.app.use(express.static('public'));
    }

    //Aca definimos todas las rutas para que puedan ser utilizadas
    //Aca definimos que en el path (/categorias, /usuarios, etc), vamos a utilizar las rutas definidas en el router
    routes() {
        //this.app.use(this.paths.uploads, uploads);
    }

    configuracionSockets() {
        //socket es el cliente conectado
        this.io.on('connection', socketController);
    }

    listen() {
        this.server.listen(this.port , () => {
            console.log(`Example app listening at http://localhost:${this.port}`);
        });
    }

}