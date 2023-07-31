const {response, request} = require('express');
const bcryptjs = require('bcryptjs');
const { User } = require('../models');

const usersGet = async(req = request, res = response) => {

    const { limit = 5, from = 0} = req.query;
    const query = { estado: true };

    const [ total, users ] = await Promise.all([
        User.countDocuments( query ),
        User.find( query )
        .skip(Number(from))
        .limit(Number(limit))
    ])
    
    res.json({
        total,
        users
    });
}

const usersPut = async(req, res = response) => {

    const id = req.params.id;
    const { _id, password, google, ...resto } = req.body;

    if( password ) {
        // Encriptar contra
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync( password, salt );
    }

    const userDB = await User.findByIdAndUpdate( id, resto )


    res.json(userDB)
}

const usersPost = async(req, res = response) => {

    const {nombre, correo, password, rol} = req.body;
    const user = new User({nombre, correo, password, rol});

    // Encriptar contra
    const salt = bcryptjs.genSaltSync();
    user.password = bcryptjs.hashSync( password, salt )

    // Guardar en BD
    await user.save();

    res.json({
        user
    })
};

const usersDelete = async(req, res = response) => {

    const { id } = req.params

    // Fisicamente lo borramos
    // const user = await User.findByIdAndDelete( id );

    const user = await User.findByIdAndUpdate( id, {estado: false} )



    res.json({user})
};

const usersPatch = (req, res = response) => {
    res.json({
        msg: 'patch API - controlador',
        code: 2310
    })
};

module.exports = {
    usersGet,
    usersPut,
    usersPost,
    usersDelete,
    usersPatch
}