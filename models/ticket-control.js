///En este modelo vamos a manejar toda la logica de los tickets

import ticketsData from '../db/data.json' assert { type: 'json' };

import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//Creamos la clase ticket para establecer el numero y el escritorio al que se designa
export class Ticket {

    constructor(numero, escritorio) {
        this.numero = numero;
        this.escritorio = escritorio;
    }
}

export class TicketControl {

    //En los constructores podemos todas las propiedades que vamos a utilizar
    constructor() {
        //Ultimo ticket que estamos atendiendo
        this.ultimo = 0;
        this.hoy = new Date().getDate();
        this.tickets = [];
        this.ultimos4 = [];

        this.init()
    }

    ///Para obtener la data que tengo que grabar en data.json
    //Cuanod llamemos al toJson va a generar este obj con la data correspondiente
    get toJson() {
        return {
            ultimo: this.ultimo,
            hoy: this.hoy,
            tickets: this.tickets,
            ultimos4: this.ultimos4,
        }
    }

    //Inicializar la clase, leyendo el archivo data.json y establezcamos las propiedades
    init() {
        //Leemos el archivo data.json
        const { hoy, ultimo, tickets, ultimos4 } = ticketsData;
        //console.log('Hoy: ', this.hoy);
        //Aca comparamos si el dia de hoy de la db es el mismo que el dia de hoy del constructor, si es asi estamos trabajando en el mismo dia y recargamos el servidor
        if(hoy === this.hoy) {
            //los tickets van a ser igual a los tickets que tenemos en el json 
            this.tickets = tickets;
            this.ultimo = ultimo;
            this.ultimos4 = ultimos4;
        } else {
            //Es otro dia, reseteamos la db
            this.gurdarDB();
        }
    }

    //Guardar en DB
    gurdarDB() {
        const dbPath = path.join(__dirname, '../db/data.json');
        fs.writeFileSync(dbPath, JSON.stringify(this.toJson));
    }

    //Metodo para atender el siguiente ticket
    siguiente() {
        this.ultimo += 1;
        const ticket = new Ticket(this.ultimo, null);
        //Agregamos este ticket al array de tickets que se van a estar atendiendo
        this.tickets.push(ticket);
        //Lo guardamos en la db
        this.gurdarDB();
        return 'Ticket ' + ticket.numero;
    }

    //Metodo para atender tickets
    atenderTicket(escritorio) {
        //Si no tenemos tickets previos que antender
        if (this.tickets.length === 0) {
            return null;
        }

        //Si tenemos...
        const ticket = this.tickets[0];//Tomamos el primero del array

        //Cuando atendemos uno lo tenemos que quitar de la lista
        this.tickets.shift(); //El shift saca el primer elemento del array

        //Al ticket que estamos atendiendo le asignamos el escritorio
        ticket.escritorio = escritorio;

        //Tenemos que añadir los ultimos 4 tickets para mostrarlos en la pantalla
        //Tenemos que añadirlo al principio del array pq es el ticket que estoy atendiendo, con unshift
        this.ultimos4.unshift(ticket);

        //Ahora tenemos que verificar que los ultimos 4 siempre sean 4
        //Empezamos en el -1 y cortamos 1 (el ultimo)
        if (this.ultimos4.length > 4) {
            this.ultimos4.splice(-1, 1);
        }

        this.gurdarDB();
        return ticket;
    }
}