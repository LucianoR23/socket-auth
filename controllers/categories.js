const { response, request } = require("express");
const Categorie = require("../models/categorie");


const crearCategoria = async( req, res = response ) => {

    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categorie.findOne({ nombre });

    if( categoriaDB ) {
        return res.status(400).json({
            msg: `La categoria ${categoriaDB.nombre}, ya existe`
        })
    }

    const data = {
        nombre,
        user: req.user._id
    }

    const categorie = new Categorie( data );

    await categorie.save();


    res.status(201).json( categorie )

};


// obtenerCategorias - paginado - total - populate
const obtenerCategorias = async( req = request, res = response ) => {

    const { limit = 5, from = 0} = req.query;
    const query = { estado: true };

    const [ total, categories ] = await Promise.all([
        Categorie.countDocuments( query ),
        Categorie.find( query )
            .populate('user', 'nombre')
            .skip(Number(from))
            .limit(Number(limit))
    ])

    
    res.json({
        total,
        categories
    });

};

// obtenerCategoria - populate
const obtenerCategoria = async( req = request, res = response ) => {

    const id = req.params.id;

    const categorieDB = await Categorie.findById( id ).populate('user', 'nombre')

    res.json(categorieDB);

};

// actualizarCategoria
const actualizarCategoria =async(req, res = response) => {

    const { id } = req.params;
    const { estado, user, ...data } = req.body;

    data.nombre = data.nombre.toUpperCase();
    data.user = req.user._id;


    const categorieDB = await Categorie.findByIdAndUpdate( id, data, {new: true} ).populate('user', 'nombre')


    res.json(categorieDB)
}

// borrarCategoria - estado:false
const borrarCategoria = async(req, res = response) => {

    const { id } = req.params

    const categorie = await Categorie.findByIdAndUpdate( id, {estado: false}, {new: true} )



    res.json({categorie})
};

module.exports = {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoria,
    actualizarCategoria,
    borrarCategoria
}