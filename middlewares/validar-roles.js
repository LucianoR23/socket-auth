const { response } = require("express")


const adminRole = ( req, res = response, next ) => {

    if( !req.user ) {
        return res.status(500).json({
            msg: 'Se quiere verificar el rol sin validar el token priemro'
        })
    }

    const { rol, nombre } = req.user;

    if( rol !== 'ADMIN_ROLE' ) {
        return res.status(401).json({
            msg: `${nombre} no es administrador - No puede realizar esta accion`
        })
    }
    


    next();
}

const tieneRol = ( ...roles ) => {

    return ( req, res = response, next ) => {
        if( !req.user ) {
            return res.status(500).json({
                msg: 'Se quiere verificar el rol sin validar el token priemro'
            })
        }

        if( !roles.includes( req.user.rol ) ){
            return res.status(401).json({
                msg: `La accion requiere uno de estos roles ${roles}`
            })
        }
        

        next();
    }

}


module.exports = {
    adminRole,
    tieneRol
}