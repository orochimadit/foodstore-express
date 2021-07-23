const mongoose = require('mongoose');

//dapatkan model dan schema dari package mongose
const {model , Schema} = mongoose;

const orderItemSchema = Schema({
    name:{
        type:String,
        minlength:[5,'Panjang nama makanan minimal 50 karakter'],
        required:[true,'name must be filled']
    },
    price:{
        type:Number,
        required:[true,'Harga harus diisi']
    },
    qty:{
        type:Number,
        required:[true,'Harga harus diisi'],
        min:[1,'Kuantatis minimal']
    },
    product:{
        type:Schema.Types.ObjectId,
        ref:'Product'
    },
    order:{
        type:Schema.Types.ObjectId,
        ref:'Order'
    },
});

module.exports = model('OrderItem',orderItemSchema);