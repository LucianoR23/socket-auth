
const url = ( window.location.hostname.includes('localhost') ) 
            ? 'http://localhost:8084/api/auth/' 
            : 'http://localhost:8080/api/auth/';

let user = null;
let socket = null;

const btnSalir = document.getElementById("btnSalir");
const txtUid = document.querySelector('#txtUid')
const txtMensaje = document.querySelector('#txtMensaje')
const ulUsuarios = document.querySelector('#ulUsuarios')
const ulMensajes = document.querySelector('#ulMensajes')

const validarJWT = async() => {

    const token = localStorage.getItem('token');

    if( token === null || token.length <= 10 ){
        window.location = 'index.html'
        throw new Error('No hay token en el servidor')
    }
    
    const resp = await fetch( url, {
        headers: { 'x-token': token }
    } )

    const { user: userDB, token: tokenDB } = await resp.json();
    localStorage.setItem( 'token', tokenDB );
    user = userDB;
    document.title = user.nombre;

    await conectarSocket();
}

const conectarSocket = async() => {

    socket = io({
        'extraHeaders': {
            'x-token': localStorage.getItem('token')
        }
    });

    socket.on('connect', () => {
        console.log('Sockets online')
    })
    socket.on('disconnect', () => {
        console.log('Sockets offline')
    })

    socket.on( 'recibir-msj', mostrarMensajes )
    socket.on( 'usuarios-activos', mostrarUsuarios )

    socket.on('mensaje-privado', (payload) => {
        console.log('Privado', payload)
    })

}

const mostrarUsuarios = ( users = [] ) => {

    let usersHtml = '';
    users.forEach( ({ nombre, uid }) => {

        usersHtml += `
            <li>
                    <h5 class="text-success"> ${ nombre }</h5>
                    <span class="fs-6 text-muted">${ uid }</span>
            </li>
        `;
    });

    ulUsuarios.innerHTML = usersHtml;

}
const mostrarMensajes = ( mensajes = [] ) => {

    let msjHtml = '';
    mensajes.forEach( ({ nombre, mensaje }) => {

        msjHtml += `
            <li>
                    <span class="text-primary"> ${ nombre }</span>
                    <span>${ mensaje }</span>
            </li>
        `;
    });

    ulMensajes.innerHTML = msjHtml;

}

txtMensaje.addEventListener('keypress', ({ keyCode}) => {
    const msj = txtMensaje.value;
    const uid = txtUid.value;
    if( keyCode !== 13 ){ return; }
    if( msj.length === 0){ return; }

    socket.emit('enviar-mensaje', { msj, uid })

    txtMensaje.value = '';

})


btnSalir.onclick = () => {
    console.log(google.accounts.id);
    google.accounts.id.disableAutoSelect();

    google.accounts.id.revoke(localStorage.getItem("email"), (done) => {
    localStorage.clear();
    location.reload();
});

};

const main = async() => {

    await validarJWT();


}

main();

