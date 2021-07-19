// import router dari express
const router = require('express').Router();
const multer = require('multer');
const os = require('os');
//import product dari controller
const productController = require('./controller');


router.get('/products',productController.index);
//3 pasang route endpoint dengan method 'store'
router.post('/products',multer({dest:os.tmpdir()}).single('image'),productController.store)
router.put('/products/:id', multer({dest: os.tmpdir()}).single('image'),productController.update);
router.delete('/products/:id',productController.destroy);
//4 export router
module.exports = router;