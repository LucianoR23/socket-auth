const path = require('path')
const fs = require('fs')

const cloudinary = require('cloudinary').v2
cloudinary.config( process.env.CLOUDINARY_URL )

const { response } = require("express");
const { subirArchivo } = require("../helpers");

const { User, Product } = require('../models');


const cargarArchivo = async( req, res = response ) => {
    
    try {
        const nombre = await subirArchivo( req.files, undefined, 'imgs' )
        res.json({nombre})
    } catch (msg) {
        res.status(400).json({ msg });
    }

}

const actualizarArchivo = async(req, res = response) => {


    const { collection, id } = req.params

    let modelo;

    switch (collection) {
        case 'users':
            modelo = await User.findById(id)
            if ( !modelo ) {
                return res.status(400).json({
                    msg: `No existe el usuario con id ${ id }`
                })
            }
            break;
        case 'products':
            modelo = await Product.findById(id)
            if ( !modelo ) {
                return res.status(400).json({
                    msg: `No existe el producto con el id ${id}`
                })
            }
            break;
    
        default:
            return res.status(500).json({ msg: 'Se me olvido validar esto' })


    }
    

    if( modelo.img ){
        const pathImg = path.join( __dirname, '../uploads/', collection, modelo.img )
        if( fs.existsSync( pathImg ) ) {
            fs.unlinkSync( pathImg )
        }
    }

    const nombre = await subirArchivo( req.files, undefined, collection )
    modelo.img = nombre;

    await modelo.save();

    res.json( modelo )

}
const actualizarArchivoCloudinary = async(req, res = response) => {


    const { collection, id } = req.params

    let modelo;

    switch (collection) {
        case 'users':
            modelo = await User.findById(id)
            if ( !modelo ) {
                return res.status(400).json({
                    msg: `No existe el usuario con id ${ id }`
                })
            }
            break;
        case 'products':
            modelo = await Product.findById(id)
            if ( !modelo ) {
                return res.status(400).json({
                    msg: `No existe el producto con el id ${id}`
                })
            }
            break;
    
        default:
            return res.status(500).json({ msg: 'Se me olvido validar esto' })


    }
    

    if( modelo.img ){
        const nombreArr = modelo.img.split('/')
        const nombre = nombreArr[nombreArr.length - 1]
        const [ public_id ] = nombre.split('.')
        cloudinary.uploader.destroy( public_id )
    }

    const { tempFilePath } = req.files.archivo

    const { secure_url } = await cloudinary.uploader.upload( tempFilePath )

    modelo.img = secure_url;

    await modelo.save();

    res.json( modelo )

}


const mostrarImg = async( req, res = response ) => {

    const { collection, id } = req.params

    let modelo;

    switch (collection) {
        case 'users':
            modelo = await User.findById(id)
            if ( !modelo ) {
                return res.status(400).json({
                    msg: `No existe el usuario con id ${ id }`
                })
            }
            break;
        case 'products':
            modelo = await Product.findById(id)
            if ( !modelo ) {
                return res.status(400).json({
                    msg: `No existe el producto con el id ${id}`
                })
            }
            break;
    
        default:
            return res.status(500).json({ msg: 'Se me olvido validar esto' })


    }
    

    if( modelo.img ){
        const pathImg = path.join( __dirname, '../uploads/', collection, modelo.img )
        if( fs.existsSync( pathImg ) ) {
            return res.sendFile( pathImg )
        }
    }

    const pathNoImg = path.join( __dirname, '../assets/no-image.jpg' )
    res.sendFile( pathNoImg )

}

module.exports= {
    cargarArchivo,
    actualizarArchivo,
    mostrarImg,
    actualizarArchivoCloudinary
}