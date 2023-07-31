const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos, validarArchivoSubir } = require('../middlewares');
const { cargarArchivo, actualizarArchivo, mostrarImg, actualizarArchivoCloudinary } = require('../controllers/uploads');
const { coleccionesPermitdas } = require('../helpers');



const router = Router();

router.post('/', validarArchivoSubir, cargarArchivo)

router.put('/:collection/:id', [
    validarArchivoSubir,
    check('id', 'El id debe ser de mongo').isMongoId(),
    check('collection').custom( c => coleccionesPermitdas( c, ['users', 'products'] ) ),
    validarCampos,
], actualizarArchivoCloudinary)
// ], actualizarArchivo)

router.get('/:collection/:id', [
    check('id', 'El id debe ser de mongo').isMongoId(),
    check('collection').custom( c => coleccionesPermitdas( c, ['users', 'products'] ) ),
    validarCampos,
], mostrarImg)

module.exports = router;