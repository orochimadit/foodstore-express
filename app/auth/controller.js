const User = require('../user/model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const config = require('../config');

async function register(req,res,next){
    try {
        const payload = req.body;
        //buat objek user baru
        let user = new User(payload);
        //simpan user ke mongodb
        await user.save();
        return res.json(user);
    } catch (err) {
        if(err && err.name==='ValidationError'){
            return res.json({
                error:1,
                message:err.message,
                fields:err.errors
            });
        }
        //
        next(err);
    }
}

async function localStrategy(email, password, done){
    try {
        let user = await User.findOne({email})
                        .select(-__v -createdAt -updateAt -cart_items -token);
        // jika user tiudak ditemukan ,akhiri proses login
        if(!user){
            return done();
        }

        //sampai disini artinya user ditemukan cek password sesuai atau tidak
        if(bcrypt.compareSync(password,user.password)){
            ({password, ...userWithoutPassword} = user.toJSON());
            return done(null,userWithoutPassword);
        }
    } catch (err) {
        done(err,null) //tangani error
    }
    done();
}

async function login(req, res, next){
    passport.authenticate('login',async function(err, user){
        if(err)return next(err);
        if(!user)return res.json({error:1,message:'email or password incorrect'})
    
    //1 buat json web token
    let signed = jwt.sign(user,config.secretKey);
    await User.findOneAndUpdate({_id:user._id},{$push:{token:signed}},{new:true});

    return res.json({
        message:'Logged in successfully',
        user:user,
        token:signed
        })
    })(req,res,next);
}

function me(req, res, next){
    if(!req.user){
        return res.json({
            error:1,
            message: 'Your not login or token expired'
        });
    }
    return res.json(req.user);

}

async function logout(req, res, next){
    //didapatkan token dari request
    let token = getToken(req);
    let user = await User.findOneAndUpdate({
        token:{$in:[token]}},
        {$pull:{token}},
        {useFindAndModify:false});

    if(!user || !token){
        return res.json({
            error:1,
            message:'No User Found'
        });
    }
    return res.json({
        error:0,
        message:'Logout Berhasil'
    });
}
module.exports = {
    register,
    localStrategy, //localstrategy
    login,
    me,
    logout
}

