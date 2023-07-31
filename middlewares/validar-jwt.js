const { response } = require('express')
const jwt = require('jsonwebtoken')

const User = require('../models/user')

const validarJWT = async( req, res = response, next ) => {

    const token = req.header('x-token')

    if( !token ) {
        return res.status(401).json({
            msg: 'No hay token en la peticion'
        })
    }

    try {
        
        const { uid } = jwt.verify( token, process.env.SECRETKEY )

        // leer usuario que corresponde al id
        const user = await User.findById( uid );

        if( !user ) {
            return res.status(401).json({
                msg: 'Token no valido - usuario no existe'
            })
        }

        if( !user.estado ) {
            return res.status(401).json({
                msg: 'Token no valido - usuario estado false'
            })
        }



        req.user = user;
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: 'Token no valido'
        })
    }
}

module.exports = {
    validarJWT
}