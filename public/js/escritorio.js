//Referencias HTML
const lblEscritorio = document.querySelector('h1'); //El primero que encuentra
const btnAtender = document.querySelector('button');
const lblTicket = document.querySelector('small');
const divAlerta = document.querySelector('.alert');
const lblPendientes = document.querySelector('#lblPendientes');

//Aca vamos a leer los parametros de la URL para saber de que escritorio nos estan llamando
//URLSearchParams solo funciona en Chrome y Firefox
const searchParams = new URLSearchParams(window.location.search);

if (!searchParams.has('escritorio')) {
    window.location = 'index.html';
    throw new Error('El escritorio es obligatorio');
}

//Para obtener el param (escritorio) que viene en la url
const escritorio = searchParams.get('escritorio');
lblEscritorio.innerHTML = 'Escritorio ' + escritorio;

divAlerta.style.display = 'none';

const socket = io();

socket.on('connect', () => {
    btnAtender.disabled = false;

});

socket.on('disconnect', () => {
    btnAtender.disabled = true;
    
});

//Aca escuchamos el los tickets pendientes para informar cuantos faltan
socket.on('tickets-pendientes', (pendientes) => {
    if (pendientes === 0) {
        lblPendientes.style.display = 'none';
    } else {
        lblPendientes.style.display = '';
    }
    lblPendientes.innerHTML = pendientes;
});

btnAtender.addEventListener( 'click', () => {
    
    socket.emit( 'atender-ticket', {escritorio}, ({ok, ticket, msg}) => { //Aca podemos desesctructurar lo que retorna este evento
        if (!ok) {
            lblTicket.innerHTML = `Nadie`;
            return divAlerta.style.display = '';
        }

        lblTicket.innerHTML = `Ticket ${ticket.numero}`;

    });

});