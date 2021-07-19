//dapatkan router dari express

const router = require('express').Router();

// import multer untuk menangani form data
const multer = require('multer');

//import category controller 
const categoryController = require('./controller');

//endpoint untuk membuat kategori baru

router.post('/categories',multer().none(),categoryController.store);
router.put('/categories/:id',multer().none(),categoryController.update);
router.delete('/categories/:id',multer().none(),categoryController.destroy);
//ini di gunakan untuk app.js
module.exports = router;