const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT, tieneRol, adminRole } = require('../middlewares');
const { crearProducto, obtenerProductos, obtenerProducto, actualizarProducto, borrarProducto } = require('../controllers/products');
const { existeProductoId, existeCategoriaId } = require('../helpers/db-validators');

const router = Router();


/**
 * {{url}}/api/productos
 */

// Obtener todas las productos - publico
router.get('/', obtenerProductos);

// Obtener una producto por id - publico
router.get('/:id', [
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existeProductoId ),
    validarCampos,
], obtenerProducto );

// Crear una producto - privado
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categorie', 'No es un id valido').isMongoId(),
    check('categorie').custom( existeCategoriaId ),
    validarCampos
], crearProducto );

// Actualizar una producto por id - privado
router.put('/:id', [
    validarJWT,
    // check('categorie', 'No es un id valido').isMongoId(),
    check('id').custom( existeProductoId ),
    validarCampos
], actualizarProducto );

// Eliminar una producto por id - privado solo admin
router.delete('/:id', [
    validarJWT,
    adminRole,
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom( existeProductoId ),
    validarCampos
], borrarProducto );

module.exports = router;