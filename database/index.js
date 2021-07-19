//import package mongoose
const mongoose = require('mongoose');
const {dbHost,dbName,dbPort,dbUser,dbPass} = require('../app/config')

//connect ke mongodob menggunakan konfigurasi yg telah diimport
console.log(`mongodb://${dbUser}:${dbPass}@${dbHost}:${dbPort}/${dbName}`)
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose
 
.connect(`mongodb://${dbUser}:${dbPass}@${dbHost}:${dbPort}/${dbName}?authSource=admin`);

const db = mongoose.connection;
 //export db supaya bisa digunakan oleh file lain yg membutuhkan
module.exports = db;