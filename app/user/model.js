const mongoose  = require('mongoose');
const bcrypt    = require('bcrypt');
const HASH_ROUND = 10;
const AutoIncrement = require('mongoose-sequence')(mongoose);
const {model , Schema}  = mongoose;

let userSchema = Schema({
    full_name:{
        type: String,
        required:[true,'Nama harus diisi'],
        maxlength:[255,'Panjang nama harus di antara 3- 255 karakter'],
        minlength:[3, 'Panjang nama harus antara 3 - 255 karakter']
    },
    customer_id:{
        type:Number
    },
    email:{
        type:String,
        required:[true,'Email harus diisi'],
        maxlength:[255,'Panjang email maksimal 255 karakter'],
    },
    password:{
        type:String,
        required:[true,'password harus diisi'],
        maxlength:[255,'Panjang password maksimal 255 karakter'],
    },
    role:{
        type:String,
        enum:['user','admin'],
        default: 'user'
    },
    token:[String]
},{timestamps:true});

userSchema.path('email').validate(
    async function(value){
        try {
            const count = await this.model('User').count({email:value});

            return !count;
        } catch (err) {
            throw err
        }
    },attr => `${attr.value} Sudah terdaftar`);

    userSchema.pre( 'save',function(next){
        this.password = bcrypt.hashSync(this.password,HASH_ROUND);
        next();
    })
    userSchema.plugin(
        AutoIncrement,{inc_field:'customer_id'}
    );
module.exports = model('User', userSchema);