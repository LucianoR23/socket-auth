const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT, tieneRol, adminRole } = require('../middlewares');
const { crearCategoria, obtenerCategorias, obtenerCategoria, actualizarCategoria, borrarCategoria } = require('../controllers/categories');
const { existeCategoriaId } = require('../helpers/db-validators');

const router = Router();


/**
 * {{url}}/api/categories
 */

// Obtener todas las categorias - publico
router.get('/', obtenerCategorias);

// Obtener una categoria por id - publico
router.get('/:id', [
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom( existeCategoriaId ),
    validarCampos
], obtenerCategoria );

// Crear una categoria - privado
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], crearCategoria );

// Actualizar una categoria por id - privado
router.put('/:id', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom( existeCategoriaId ),
    validarCampos
], actualizarCategoria );

// Eliminar una categoria por id - privado solo admin
router.delete('/:id', [
    validarJWT,
    adminRole,
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom( existeCategoriaId ),
    validarCampos
], borrarCategoria );

module.exports = router;