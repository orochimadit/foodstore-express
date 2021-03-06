const Category = require('./model');


async function store(req, res, next){
    try {
        let policy = policyFor(req.user);
        if(!policy.can('create','Category')){
         return res.json({
             error:1,
             message:`Anda tidak memiliki akses untuk membuat Category`
         });
        }
        let payload = req.body;

        let category = new Category(payload);

        await category.save();
        return res.json(category);
    } catch (err) {
        if(err && err.name ==='ValidationError'){
            return res.json({
                error:1,
                message: err.message,
                fields:err.err
            });
        }
        next(err);
    }
}

async function update(req, res, next){
    try {
        let policy = policyFor(req.user);
        if(!policy.can('update','Category')){
         return res.json({
             error:1,
             message:`Anda tidak memiliki akses untuk mengupdate Category`
         });
        }
        let payload = req.body;

        let category = await Category.findOneAndUpdate({_id:req.params.id},payload,{new:true,runValidators:true});

        return res.json(category);
    } catch (err) {
        if(err && err.name ==='ValidationError'){
            return res.json({
                error:1,
                message: err.message,
                fields:err.err
            });
        }
        next(err);
    }
}

async function destroy(req, res, next){
 
    try {
        let policy = policyFor(req.user);
        if(!policy.can('delete','Category')){
         return res.json({
             error:1,
             message:`Anda tidak memiliki akses untuk membuat Category`
         });
        }
        //cari dan hapus category di mongoDB berdasarkan field _id
        let deleted = await Category.findOneAndDelete({
            _id:req.params.id
        });
        //respon ke client dengan data category yang baru saja di hapus
        return res.json(deleted);
    } catch (err) {
        //kemungkinan error

        next(err);
    }
}

module.exports ={
    store,
    update,
    destroy,
}