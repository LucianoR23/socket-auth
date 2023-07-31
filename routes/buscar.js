const { Router } = require('express');
const { buscar } = require('../controllers/buscar');


const router = Router();

router.get('/:collection/:term', buscar )




module.exports = router;