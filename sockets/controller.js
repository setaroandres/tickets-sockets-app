//Controlador de toda la comunicacion con sockets

import { TicketControl } from "../models/ticket-control.js";

//Instanciamos la clase y disparamos el constructor
export const ticketControl = new TicketControl();

export const socketController = (socket) => {

    //socket.on('disconnect', () => {});
    socket.emit('ultimo-ticket', ticketControl.ultimo); //Tomamos el ultimo ticket para saber cual es el siguiente
    socket.emit('estado-actual', ticketControl.ultimos4); //Mandamos los ultimos 4 para mostrar en la pantalla publica
    //Creamos el listener para escuchar al cliente
    //enviar-mensaje es el nombre del mensaje que vamos a estar escuchando y se los vamos a mandar a 1 o mas clientes (definido en socket-client.js)
    //El el payload tenemos el mensaje, aca recibimos el callback del emit del cliente
    //En el callback le vamos a mostrar cual es el ticket que tiene que mostrar para el siguiente
    socket.emit('tickets-pendientes', ticketControl.tickets.length);

    socket.on('siguiente-ticket', (payload, callback) => {

        //Es lo que retorna mi metodo siguiente()
        const siguiente = ticketControl.siguiente();
        callback(siguiente);
        socket.broadcast.emit('tickets-pendientes', ticketControl.tickets.length);
    });

    socket.on('atender-ticket', ({escritorio}, callback) => {
        
        if (!escritorio) {
            return callback({
                ok: false,
                msg: 'El escritorio es obligatorio'
            });
        }

        const ticket = ticketControl.atenderTicket(escritorio);
        socket.broadcast.emit('estado-actual', ticketControl.ultimos4);
        socket.emit('tickets-pendientes', ticketControl.tickets.length);
        socket.broadcast.emit('tickets-pendientes', ticketControl.tickets.length);
        
        if (!ticket) {
            return callback({
                ok: false,
                msg: 'Ya no hay tickets'
            });
        } else {
            return callback({
                ok: true,
                ticket
            })
        }
    });

}