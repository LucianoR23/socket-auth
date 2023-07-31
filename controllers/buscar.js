const { response } = require("express");
const { ObjectId} = require('mongoose').Types;
const { User, Categorie, Product } = require('../models');

const coleccionesPermitidas = [
    'categories',
    'products',
    'users'
];

const buscarUsuarios = async( term = '', res = response) => {

    const esMongoID = ObjectId.isValid( term );
    if( esMongoID ) {
        const user = await User.findById( term );
        return res.json({
            results: ( user ) ? [ user ] : []
        })
    }

    const regex = new RegExp( term, 'i')
    const users = await User.find({
        $or: [ { nombre: regex }, { correo: regex } ],
        $and: [ { estado: true } ]
    });

    return res.json({
        results: users
    });

};

const buscarProductos = async( term = '', res = response) => {

    const esMongoID = ObjectId.isValid( term );
    if( esMongoID ) {
        const product = await Product.findById( term ).populate('categorie', 'nombre');
        return res.json({
            results: ( product ) ? [ product ] : []
        })
    }

    const regex = new RegExp( term, 'i')
    const products = await Product.find({ nombre: regex, estado: true }).populate('categorie', 'nombre');

    return res.json({
        results: products
    });

};

const buscarCategorias = async( term = '', res = response) => {

    const esMongoID = ObjectId.isValid( term );
    if( esMongoID ) {
        const categorie = await Categorie.findById( term );
        return res.json({
            results: ( categorie ) ? [ categorie ] : []
        })
    }

    const regex = new RegExp( term, 'i')
    const categories = await Categorie.find({ nombre: regex, estado: true });

    return res.json({
        results: categories
    });

};

const buscar = ( req, res = response ) => {

    const { collection, term } = req.params;

    if( !coleccionesPermitidas.includes( collection ) ) {
        return res.status(400).json({
            msg: `Las colecciones permitidas son: ${ coleccionesPermitidas }`
        })
    }

    switch (collection) {
        case 'users':
            buscarUsuarios( term, res )
            break;
        case 'products':
            buscarProductos( term, res )
            break;
        case 'categories':
            buscarCategorias( term, res )
            break;
    
        default:
            res.status(500).json({
                msg: 'Se olvido de hacer esta busqueda'
            })
    }

}

module.exports = {
    buscar
}