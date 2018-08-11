var mongoose = require('mongoose');
var admin = mongoose.model('adminCreate');


exports.adminCreate = function(req, res){

    var adminNew = new admin();
    adminNew.userName = req.body.username;
    adminNew.userEmail = req.body.email;
    adminNew.userPassword = req.body.password;
   
    console.log(adminNew.userEmail);

    adminNew.save(function(err, savedUser){
        if (err){
            console.log('user name or email already exists');
            var message = 'user name or email already exists';
            res.render('adminUser', {errorMessage: message});
            return;
        } else {
            req.session.newUser = savedUser.userName;
            res.flash('notify', 'You have registered successfully');
        }
    })

}

exports.adminLogin = function(req, res){
    //var adminNew = new admin();
    console.log('inside the login function');
    
    var userEmail = req.body.adminEmail;
    var userPassword = req.body.adminPassword;

    console.log('login request--------->>>>',userEmail);

    admin.findOne({userEmail: userEmail}, function(err, user){
        if(user == null){
            console.log('user email does not exist');
            res.status(203).send('No such user exists');
            return;
        } 
        console.log('user found', user.userEmail);
        user.comparePassword(userPassword, function(err, isMatch){
            console.log('inside the function comparePassword', err, isMatch)
            if(isMatch && isMatch == true){
                console.log('login successfull')
                req.session.username = admin.userName;
                req.session.loggedIn = true;
                res.status(201).send({session: req.session});
            } else {
                console.log('Password mismatch')
                var message = 'invalid email or password';
                res.status(203);
                return;
            }
        })
        
        
    })
}