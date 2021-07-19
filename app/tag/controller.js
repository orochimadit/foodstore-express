const Tag = require('./model');

async function store(req, res, next){
    try {
        //dapatkan data dari reques yang dikirimkan client
        let payload = req.body;
        //buat objek tag baru berdasarkan payload
        let tag = new Tag(payload)

        //simpan tag ke mongodb
        await tag.save();
        return res.json(tag);
    } catch (err) {
        //menangani kemungkinan error validasi dan error lainnya
        if(err && err.name ==='ValidationError'){
            return res.json({
                error:1,
                message:err.message,
                fields:err.errors
            })
        }
        next(err);
    }
}

async function update(req, res, next){
    try {
        //dapatkan data dari reques yang dikirimkan client
        let payload = req.body;
        //buat objek tag baru berdasarkan payload
        let tag = await Tag.findOneAndUpdate({_id:req.params.id},payload,{new:true,runValidators:true})

        //simpan tag ke mongodb
        return res.json(tag);
    } catch (err) {
        //menangani kemungkinan error validasi dan error lainnya
        if(err && err.name ==='ValidationError'){
            return res.json({
                error:1,
                message:err.message,
                fields:err.errors
            })
        }
        next(err);
    }
}

async function destroy(req, res, next){
    try {
        let tag = await Tag.findOneAndDelete({_id:req.params.id}) 
    } catch (err) {
        next(err)
    }
}
module.exports ={
    store,
    update,
    destroy
}