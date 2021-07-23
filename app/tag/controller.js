const Tag = require('./model');

async function store(req, res, next){
    try {
       
        let policy = policyFor(req.user);
        if(!policy.can('create','Tag')){
         return res.json({
             error:1,
             message:`Anda tidak memiliki akses untuk membuat Tag`
         });
        } //dapatkan data dari reques yang dikirimkan client
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
        let policy = policyFor(req.user);
        if(!policy.can('update','Tag')){
         return res.json({
             error:1,
             message:`Anda tidak memiliki akses untuk mengupdate Tag`
         });
        }
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
        let policy = policyFor(req.user);
        if(!policy.can('delete','Tag')){
         return res.json({
             error:1,
             message:`Anda tidak memiliki akses untuk menghapus Tag`
         });
        }
        let tag = await Tag.findOneAndDelete({_id:req.params.id}) 
        return res.json(tag);
    } catch (err) {
        next(err)
    }
}
module.exports ={
    store,
    update,
    destroy
}