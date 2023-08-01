const express = require('express')
const cors = require('cors');
const fileUpload = require('express-fileupload')

const { dbConnection } = require('../database/config');
const { socketController } = require('../sockets/controller');


class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.server = require('http').createServer( this.app );
        this.io = require('socket.io')(this.server)



        this.path = {
            auth: '/api/auth',
            buscar: '/api/buscar',
            categories: '/api/categories',
            products: '/api/products',
            uploads: '/api/uploads',
            users: '/api/users',
        }

        this.conectarDB();

        // Middlewares
        this.middlewares();

        this.routes();

        this.sockets();
    }

    async conectarDB() {
        await dbConnection();
    }

    middlewares() {

        this.app.use( cors() )

        // Lectura y parseo del body
        this.app.use( express.json() );

        this.app.use(express.static('public'));

        this.app.use(fileUpload({
                useTempFiles : true,
                tempFileDir : '/tmp/',
                createParentPath: true
            }));

    }

    routes() {
        this.app.use(this.path.auth, require('../routes/auth'))
        this.app.use(this.path.buscar, require('../routes/buscar'))
        this.app.use(this.path.categories, require('../routes/categories'))
        this.app.use(this.path.products, require('../routes/products'))
        this.app.use(this.path.uploads, require('../routes/uploads'))
        this.app.use(this.path.users, require('../routes/users'))
    }

    sockets() {
        this.io.on("connection", ( socket ) => socketController( socket, this.io ) )
    }

    listen() {
        this.server.listen(this.port, () => {
            console.log(`Example app listening on port ${this.port}`)
        })
    }


}


module.exports = Server;