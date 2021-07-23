const mongoose = require('mongoose')
const {model, Schema} = mongoose;

const invoiceSchema=Schema({
    sub_total:{
        type:Number,
        required:[true,'sub Total harus diisi']
    },
    delivery_fee:{
        type:Number,
        required:[true,'delivery_fee harus diisi']
    },
    delivery_address:{
        provinsi:{
            type:String,
            required:[true,'Provinsi harus diisi.']
        },
        kabupaten:{
            type:String,
            required:[true,'Kabupaten harus diisi']
        },
        kecamatan:{
            type:String,
            required:[true,'Kecamatan harus diisi']
        },
        kelurahan:{
            type:String,
            required:[true,'Kelurahan harus diisi']
        },
        detail:{
            type:String
        }
    },
    total:{
        type:Number,
        required:[true,'Total Harus Diisi']
    },
    payment_status:{
        type:String,
        enum:['waiting_payment','paid'],
        default:'waiting_payment'
    },
    user:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    order:{
        type:Schema.Types.ObjectId,
        ref:'Order'
    }
},{timestamps:true});

orderSchema.post('save', async function(){
    let sub_total = this.order_items.reduce((sum, item) => sum += (item.price * item.qty), 0)
  
  
    // (1) buat objek `invoice` baru
    let invoice = new Invoice({
      user: this.user, 
      order: this._id, 
      sub_total: sub_total, 
      delivery_fee: parseInt(this.delivery_fee),
      total: parseInt(sub_total + this.delivery_fee), 
      delivery_address: this.delivery_address
    });
  
    // (2) simpan ke MongoDB
    await invoice.save();
  
  });
module.exports = model('Invoice',invoiceSchema);