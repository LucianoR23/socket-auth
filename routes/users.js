
const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos,validarJWT, adminRole, tieneRol } = require('../middlewares');

const { esRoleValido, emailExiste, existeUsuerId } = require('../helpers/db-validators');
const { usersGet, usersPut, usersPost, usersDelete, usersPatch } = require('../controllers/users');

const router = Router();

router.get('/', usersGet);

router.put('/:id', [
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom( existeUsuerId ),
    check('rol').custom( esRoleValido ),
    validarCampos
] ,usersPut)

router.post('/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'La contraseña es obligatoria y debe ser de mas de 6 caracteres').isLength({ min: 6 }),
    check('correo').custom( emailExiste ),
    // check('rol', 'No es un rol valido').isIn(['ADMIN_ROLE', "USER_ROLE"]),
    check('rol').custom( esRoleValido ),
    validarCampos
] ,usersPost)

router.delete('/:id', [
    validarJWT,
    // adminRole,
    tieneRol('ADMIN_ROLE', 'VENTAS_ROLE'),
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom( existeUsuerId ),
    validarCampos
] ,usersDelete)

router.patch('/', usersPatch)





module.exports = router;