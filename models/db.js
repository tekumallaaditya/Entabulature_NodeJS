var mongoose = require('mongoose');
var chalk = require('chalk');
var bcrypt=require('bcrypt');
var SALT_WORK_FACTOR = 10;

var dbURL = 'mongodb://localhost/Entabulature';

mongoose.connect(dbURL);

mongoose.connection.on('connected', function(){
    console.log(chalk.green('mongo DB connected'));
});

mongoose.connection.on('disconnected', function(){
    console.log(chalk.yellow('mongo DB disconnected'));
});

mongoose.connection.on('error', function(err){
    console.log(chalk.red('mongo DB error' + err));
});

var adminSchema = new mongoose.Schema({
    userName: {type: String, unique: true},
    userEmail: {type: String, unique: true},
    userPassword: {type: String}
});

adminSchema.pre('save', function(next){
    var user = this;
    console.log('inside the pre-save function');

    if(!user.isModified('userPassword')) return next();

    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt){
        if(err) return next(err);

        bcrypt.hash(user.userPassword, salt, function(err, hash){
            if(err) return next(err);

            user.userPassword = hash;
            next();
        });
    });
});

adminSchema.methods.comparePassword = function(candidatePassword, cb){
    console.log(candidatePassword, this.userPassword)
    bcrypt.compare(candidatePassword, this.userPassword, function(err, isMatch){
        if(err) return cb(err);

        cb(null, isMatch);
    });
}

mongoose.model('adminCreate', adminSchema);
