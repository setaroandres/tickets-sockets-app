//Referencias HTML
const lblNuevoTicket = document.querySelector('#lblNuevoTicket');
const btnCrear = document.querySelector('button');

const socket = io();

socket.on('connect', () => {
    btnCrear.disabled = false;
});

socket.on('disconnect', () => {
    btnCrear.disabled = true;
});

//Aca escuchamos el ultimoo ticket atendido asi lo mostramos en a pantalla por defecto
socket.on('ultimo-ticket', (ultimo) => {
    lblNuevoTicket.innerHTML = 'Ticket ' + ultimo;
});

btnCrear.addEventListener( 'click', () => {

    socket.emit( 'siguiente-ticket', null, ( ticket ) => {
        lblNuevoTicket.innerHTML = ticket;
    });

});