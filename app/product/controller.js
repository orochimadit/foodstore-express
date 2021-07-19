const Product = require('./model');
const config = require('../config')
const fs = require('fs');
const path = require('path');
//buat function store 

async function store(req,res,next){
    // > tangkap data form yang dikirimkan oleh client sebagai variabel `payload`
   try{
    let payload = req.body;

    //buat product baru menggunakan data dari payload
    if(req.file){
        let tmp_path = req.file.path;
        let originalExt = req.file.originalname.split('.')
        [req.file.originalname.split('.').length - 1];
        let filename = req.file.filename+'.'+originalExt;
        let target_path = path.resolve(config.rootPath,`public/upload/${filename}`);
        //baca file yg masih di lokasi sementara
        const src = fs.createReadStream(tmp_path);
        //pindahkan file ke lokasi permanen
        const dest = fs.createWriteStream(target_path);
        //mulai pindahkan file dari src ke dest
        src.pipe(dest);
        src.on('end',async () => {
            try {
                let product = new Product({...payload,image_url:filename})
                await product.save()
                return res.json(product);
            } catch (err) {
                //jika error hapus file yang sudah terupload pada dierror
                fs.unlinkSync(target_path);
                if(err && err.name=='ValidationError'){
                    return res.json({
                        error:1,
                        message: err.message,
                        fields: err.errors
                    });
                }
                next(err);
            }
        })
        src.on('error',async()=>{
            next(err);
        });
    }else{
        let product = new Product(payload);
        await product.save();
        return res.json(product);
    }
   
   }catch(err){
    if(err && err.name ==='ValidationError'){
        return res.json({
            error:1,
            message:'Pesan error dari mongoose validation',
            fields: {
                name:{
                    properties:{
                        message: "Nama makanan harus diisi",
                        type:   "required",
                        path: "name"
                    },
                    kind: "required",
                    path:"name"
                }
            }
        });
    }
    next(err);

   }
}
// index 
async function index(req,res,next){
    try {
        let = {limit=10,skip=0 } = req.query;
        let products = await Product.find().limit(parseInt(limit)).skip(parseInt(skip));
        return res.json(products);
    } catch (err) {
        next(err);
    }
}


async function update(req,res,next){
    // > tangkap data form yang dikirimkan oleh client sebagai variabel `payload`
   try{
    let payload = req.body;

    //buat product baru menggunakan data dari payload
    if(req.file){
        let tmp_path = req.file.path;
        let originalExt = req.file.originalname.split('.')
        [req.file.originalname.split('.').length - 1];
        let filename = req.file.filename+'.'+originalExt;
        let target_path = path.resolve(config.rootPath,`public/upload/${filename}`);
        //baca file yg masih di lokasi sementara
        const src = fs.createReadStream(tmp_path);
        //pindahkan file ke lokasi permanen
        const dest = fs.createWriteStream(target_path);
        //mulai pindahkan file dari src ke dest
        src.pipe(dest);
        src.on('end',async () => {
            try {
                let product =  await Product.findOne({_id: req.params.id});
                let currentImage = `${config.rootPath}/public/upload/${product.image_url}`;
                if(fs.existsSync(currentImage)){
                    fs.unlinkSync(currentImage)
                }
                product =await Product.findOne({_id:req.params.id},{...payload, image_url:filename},{new:true,runValidators:true});
                return res.json(product);
            } catch (err) {
                //jika error hapus file yang sudah terupload pada dierror
                fs.unlinkSync(target_path);
                if(err && err.name=='ValidationError'){
                    return res.json({
                        error:1,
                        message: err.message,
                        fields: err.errors
                    });
                }
                next(err);
            }
        })
        src.on('error',async()=>{
            next(err);
        });
    }else{
        let product =await Product.findOne({_id:req.params.id},{...payload, image_url:filename},{new:true,runValidators:true});
        return res.json(product);
    }
   
   }catch(err){
    if(err && err.name ==='ValidationError'){
        return res.json({
            error:1,
            message:'Pesan error dari mongoose validation',
            fields: {
                name:{
                    properties:{
                        message: "Nama makanan harus diisi",
                        type:   "required",
                        path: "name"
                    },
                    kind: "required",
                    path:"name"
                }
            }
        });
    }
    next(err);

   }
}

// destroy
async function destroy(req, res, next){
    try {
        let product = await Product.findOneAndDelete({_id:req.params.id});

        let currentImage = `${config.rootPath}/public/upload/${product.image_url}`;
        if (fs.existsSync(currentImage)){
            fs.unlinkSync(currentImage)
        }
        return res.json(product);
    } catch (error) {
        next(error);
    }
}
module.exports = {
    index,
    update,
    store,
    destroy
}