const { Socket } = require("socket.io");
const { comprobarJWT } = require("../helpers");
const { ChatMensajes } = require("../models");

const chatMensajes = new ChatMensajes();

const socketController = async( socket = new Socket(), io ) => {

    const user = await comprobarJWT( socket.handshake.headers['x-token'] );
    if( !user ){
        return socket.disconnect();
    }

    chatMensajes.conectarUsuario( user )
    io.emit( 'usuarios-activos', chatMensajes.usuariosArr );
    socket.emit('recibir-msj', chatMensajes.ultimos10)

    socket.join( user.id );

    socket.on('disconnect', () => {
        chatMensajes.desconectarUsuario( user.id )
        io.emit( 'usuarios-activos', chatMensajes.usuariosArr )
    })

    socket.on('enviar-mensaje', ({ uid, msj }) => {

        if( uid ){
            socket.to( uid ).emit('mensaje-privado', { de: user.nombre, msj })
        }else{
            chatMensajes.enviarMensaje(user.id, user.nombre, msj);
            io.emit('recibir-msj', chatMensajes.ultimos10)
        }

    })

}

module.exports = {
    socketController
}