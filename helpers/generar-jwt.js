const jwt = require('jsonwebtoken');
const { User } = require('../models')



const generarJWT = ( uid = '') => {

    return new Promise( (res, rej) => {

        const payload = { uid };

        jwt.sign( payload, process.env.SECRETKEY, {
            expiresIn: '2h'
        }, (err, token) => {
            if(err) {
                console.log(err);
                rej('No se pudo generar el token')
            } else {
                res(token);
            }
        } )


    })

}

const comprobarJWT = async( token = '' ) => {

    try {
        
        if( token.length < 10 ){
            return null;
        }

        const { uid } = jwt.verify( token, process.env.SECRETKEY );
        const user = await User.findById( uid );

        if( user.estado ){
            return user;
        }else {
            return null
        }

    } catch (error) {
        return null;
    }

}

module.exports = {
    generarJWT,
    comprobarJWT
}