const { response, request } = require("express");
const Product = require("../models/product");


const crearProducto = async( req, res = response ) => {

    const { estado, user, ...body } = req.body;

    const productoDB = await Product.findOne({ nombre: body.nombre });

    if( productoDB ) {
        return res.status(400).json({
            msg: `El producto ${productoDB.nombre}, ya existe`
        })
    }

    const data = {
        ...body,
        nombre: body.nombre.toUpperCase(),
        user: req.user._id
    }

    const product = new Product( data );

    await product.save();


    res.status(201).json( product )

};


const obtenerProductos = async( req = request, res = response ) => {

    const { limit = 5, from = 0} = req.query;
    const query = { estado: true };

    const [ total, products ] = await Promise.all([
        Product.countDocuments( query ),
        Product.find( query )
            .populate('user', 'nombre')
            .populate('categorie', 'nombre')
            .skip(Number(from))
            .limit(Number(limit))
    ])
    
    res.json({
        total,
        products
    });

};

const obtenerProducto = async(req, res = response ) => {

    const id = req.params.id;
    const producto = await Product.findById( id )
                            .populate('user', 'nombre')
                            .populate('categorie', 'nombre');

    res.json( producto );

}

// actualizarCategoria
const actualizarProducto =async(req, res = response) => {

    const { id } = req.params;
    const { estado, user, ...data } = req.body;

    if( data.nombre ) {
        data.nombre = data.nombre.toUpperCase();
    }
    data.user = req.user._id;


    const productDB = await Product.findByIdAndUpdate( id, data, {new: true} ).populate('user', 'nombre').populate('categorie', 'nombre')


    res.json(productDB)
}

// borrarCategoria - estado:false
const borrarProducto = async(req, res = response) => {

    const { id } = req.params

    const productoBorrado = await Product.findByIdAndUpdate( id, {estado: false, disponible: false}, {new: true} )



    res.json({productoBorrado})
};

module.exports = {
    crearProducto,
    obtenerProductos,
    obtenerProducto,
    actualizarProducto,
    borrarProducto
}