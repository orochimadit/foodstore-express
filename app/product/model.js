const mongoose = require('mongoose');

//2 ambil model dan schema dari package moongose
const {model, Schema} = mongoose;

const productSchema = Schema({
    name:{
        type:String,
        minlegth:   [3 , 'Panjang nama makanan minimal 3 karakter'],
        maxlength:  [255, 'Panjang nama makanan maksimal 255 karakter'],
        required: [true, 'Nama produk harus diisi']
    },
    desciption:{
        type:String,
        maxlength:[1000, 'Panjang deskripsi maksimal 1000 karakter']
    },
    price:{
        type:Number,
        default:0
    },
    image_url: String,
    category:{
        type:Schema.Types.ObjectId,
        ref: 'Category'
    }
},{timestamps:true});


module.exports = model('Product',productSchema);