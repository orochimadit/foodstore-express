const mongoose = require('mongoose');

//dapatkan model dan schema dari package mongose
const {model , Schema} = mongoose;

//buat schema
const tagSchema = Schema({
    name:{
        type:String,
        minlength:[3,'Panjang nama tag harus minimal 3 karakter'],
        maxlengt:[20,'Panjang nama tag harus minimal 20 karakter'],
        required:[true,'Nama tag harus diisi']
    }
})

module.exports = model('Tag',tagSchema)