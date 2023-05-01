import * as dotenv from 'dotenv';
import { Server } from './models/server.js';

//Para empezar debemos instalar express, cors, dotenv

//Dotenv es para que use las variables de entorno con el .env
dotenv.config();

const server = new Server();

server.listen();