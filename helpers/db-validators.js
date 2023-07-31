const { User, Role, Categorie, Product } = require('../models');

const esRoleValido = async(rol = '') => {
    const existeRol = await Role.findOne({ rol });
    if( !existeRol ) {
        throw new Error(`El rol ${rol} no esta registrado en la BD`)
    }
};

const emailExiste = async(correo = '') => {
    const existEmail = await User.findOne({ correo })
    if( existEmail ) {
        throw new Error(`El correo: ${correo} ya esta registrado`)
    }
};

const existeUsuerId = async(id) => {
    const existeUser = await User.findById(id)
    if( !existeUser ) {
        throw new Error(`El id: ${id} no existe`)
    }
};

const existeCategoriaId = async(id) => {
    const existeCategoria = await Categorie.findById(id)
    if( !existeCategoria ) {
        throw new Error(`El id: ${id} no existe`)
    }
};

const existeProductoId = async(id) => {
    const existeProducto = await Product.findById(id);
    if( !existeProducto ) {
        throw new Error(`El id: ${id} no existe`)
    }
};

const coleccionesPermitdas = ( collection = '', collections = []) => {

    const incluida = collections.includes( collection );
    if( !incluida ) {
        throw new Error(`La coleccion ${collection}, no es permitida. Deben ser ${collections}`)
    }

    return true;

}

module.exports = {
    esRoleValido, 
    emailExiste,
    existeUsuerId,
    existeCategoriaId,
    existeProductoId,
    coleccionesPermitdas,
}