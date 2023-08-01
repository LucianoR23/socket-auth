
class Mensaje{
    constructor( uid, nombre, mensaje ) {
        this.uid = uid;
        this.nombre = nombre;
        this.mensaje = mensaje;
    }
}

class ChatMensajes {

    constructor() {
        this.mensajes = [];
        this.users = {}
    }

    get ultimos10() {
        this.mensajes = this.mensajes.slice(-10);
        
        return this.mensajes;
    }

    get usuariosArr() {
        return Object.values( this.users );
    }

    enviarMensaje( uid, nombre, mensaje ) {
        this.mensajes.push(
            new Mensaje(uid, nombre, mensaje)
        );
    }

    conectarUsuario( user ){
        this.users[user.id] = user
    }

    desconectarUsuario( id ){
        delete this.users[id];
    }

}

module.exports = ChatMensajes