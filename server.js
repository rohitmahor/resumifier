/**
 * Created by rohitkumar on 11/7/17.
 */
var express = require('express');
var bodyParser = require('body-parser');
var util = require('util');
var path = require('path');
var expressValidator = require('express-validator');
var bcrypt = require('bcrypt');
var cookieParser = require('cookie-parser');
var session  = require('express-session');
var database = require('./mongo');
const saltRounds = 10;
const fileUpload = require('express-fileupload');
var fs = require('fs');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
const MongoStore = require('connect-mongo')(session);
var flash = require('connect-flash');

app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser());
app.use(cookieParser());
app.use(session({
    secret: "keyboard dog",
    store: new MongoStore({ url: 'mongodb://resume:#rohit9810@ds139801.mlab.com:39801/resumeuser' }),
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(fileUpload());
app.use(expressValidator());
app.use(cookieParser('keyboard cat'));
// app.use(express.session({ cookie: { maxAge: 60000 }}));
app.use(flash());

app.use('/',express.static(path.join(__dirname,'public_static/login')));
// app.use('/next',authentication,express.static('public_static/final portfolio'));
app.use('/personal_details',authentication,express.static(path.join(__dirname,'public_static/form/personal_details')));
app.use('/address',authentication,express.static(path.join(__dirname,'public_static/form/address')));
app.use('/education',authentication,express.static(path.join(__dirname,'public_static/form/education')));
app.use('/experience',authentication,express.static(path.join(__dirname,'public_static/form/experience')));
app.use('/skills',authentication,express.static(path.join(__dirname,'public_static/form/skills')));
app.use('/resume',authentication,express.static(path.join(__dirname,'public_static/final portfolio')));
app.use('/error',express.static(path.join(__dirname,'public_static/error')));

//successfully login
app.get('/success',authentication,function(req,res){
    console.log(req.session.passport.user[0].email);
    database.getuser({'email':req.session.passport.user[0].email},'users',function(result){
        if(result[0].new === true){
            console.log(req.session.passport.user[0].email);
            console.log(result[0].new);
            res.redirect('/personal_details');
        }
        else {
            res.redirect('/resume');
        }
    });
});


String.prototype.capitalize = function() {
    return this.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
};

function authentication(req,res,next) {
    if(req.isAuthenticated()) {
        return next();
    }

    else {
        res.redirect('/error');
    }
}



app.post('/sign_up',function(req,res){
  var email = req.body.email;
  var password = req.body.password;
  var repassword = req.body.repassword;
  var hash = bcrypt.hashSync(password, saltRounds);

  req.checkBody('email','Email field is required.').notEmpty();
  req.checkBody('email','Invalid Email.').isEmail();
  req.checkBody('password','Passwords do not match,Please try again.').equals(repassword);
  req.checkBody('password','Invalid password.').notEmpty();
  req.checkBody('password','Password must contain 6-20 characters.').len(6,8);
  req.checkBody('email','Email should not contain more than 50 characters.').len(1,50);
  req.getValidationResult().then(function(result) {
        if (!result.isEmpty()) {
            console.log(result);
            res.send(result.array());
        }
        else {
            database.get({'email':email},'users',function(result){
                if(result.length !== 0){
                    res.send([{'msg':'This email is already exist, Try again with another email address.'}]);
                }

                else {
                    database.insert({'email':email,
                        'password':hash,
                        'personal':{'first_name':'','last_name':'','dob':'','email':'','phone':''},
                        'address':{'address':'','city':'','state':'','pincode':''},
                        'education':{'sec':{'school':'','compeletion':'','board':'','performance':'','scale':''},
                            'sen_sec':{'school':'','compeletion':'','board':'','performance':'','scale':''},
                            'grad':{'school':'','start':'','end':'','degree':'','performance':'','scale':''},
                            'post':{'school':'','start':'','end':'','degree':'','performance':'','scale':''},
                            'phd':{'school':'','start':'','end':'','degree':'','performance':'','scale':''}},
                        'experience':{'training':[],'intern':[],'job':[],'project':[]},
                        'skills':[],
                        'new':true,
                        },'users',function(result){
                        res.redirect('/');
                    });
                }

            });
        }
    });
});

passport.use(new LocalStrategy(
    function(username, password, done) {

        database.getuser({'email':username},'users',function(result) {
            if (result.length === 0) {
                return done(null, false, {message: 'Incorrect Email address'});
                // return  res.send({msg: 'Incorrect Email address'});
            }

            if (!bcrypt.compareSync(password, result[0].password)) {
                console.log(bcrypt.compareSync(password, result[0].password) + 'check password');
                return done(null, false, {message: 'Incorrect password'});
            }

            return done(null, result);
        });
    }
));


passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});



// after login submit
app.post('/login',passport.authenticate('local', { successRedirect: '/success',
    failureRedirect: '/' ,
    failureFlash:true}) );

app.get('/logout',function (req, res) {
   req.logout();
   req.session.destroy();
   res.redirect('/');
});


app.post('/personal_details_next',authentication,function(req,res){
   var first_name = req.body.firstname;
   var last_name = req.body.lastname;
   var dob = req.body.dob;
   var email = req.body.email;
   var phone = req.body.phone;
   req.checkBody('firstname','First name must be filled').notEmpty();
   req.checkBody('lastname','Last name must be filled').notEmpty();
   req.checkBody('dob','D.O.B name must be filled').notEmpty();
   req.checkBody('email','Email must be filled').notEmpty();
   req.checkBody('email','Invalid Email').isEmail();
   req.checkBody('phone','Invalid Phone no.').len(8,10);

   req.getValidationResult().then(function(result){
       if (!result.isEmpty()) {
           console.log(result);
           res.send(result.array());
       }

       else {
           database.update({'email':req.session.passport.user[0].email},
               {'personal':{'first_name':first_name.capitalize(),'last_name':last_name.capitalize(),'dob':dob,'email':email,'phone':phone},'new':false},
                   'users',function(result){
               console.log(result);
               console.log(req.session.passport.user[0].email);
               });
           res.send('Personal details add in your account');
       }


   });
});

app.post('/address_details_next',function(req,res){
    var full_address = req.body.address;
    var city = req.body.city;
    var state = req.body.state;
    var pincode = req.body.pincode;
    req.checkBody('address','Invalid address').notEmpty();
    req.checkBody('city','Invalid city').notEmpty();
    req.checkBody('state','Invalid state').notEmpty();
    req.checkBody('pincode','Pincode is required !').notEmpty();
    req.checkBody('pincode','Invalid Pincode').isInt();
    req.checkBody('pincode','Invalid Pincode').len(6);

    req.getValidationResult().then(function(result) {
        if (!result.isEmpty()) {
            console.log(result);
            res.send(result.array());
        }
        else {
            database.update({'email':req.session.passport.user[0].email},
                {'address':{'address':full_address,'city':city.capitalize(),'state':state.capitalize(),'pincode':pincode}},
                'users',function(result){
                    console.log(result);
                    console.log(req.session.passport.user[0].email);
                });
            res.send('Address details add in your account');
        }
    });

});

app.post('/secondary_details',function(req,res){
    var completion = req.body.completion;
    var scale = req.body.scale;
    var board = req.body.board;
    var performance = req.body.performance;
    var school = req.body.school;
    req.checkBody('completion','Invalid year of completion').notEmpty();
    req.checkBody('school','Invalid school').notEmpty();
    req.checkBody('board','Invalid board').notEmpty();
    req.checkBody('performance','Invalid performance').notEmpty();
    req.checkBody('scale','Invalid scale').notEmpty();
    req.getValidationResult().then(function(result) {
        if (!result.isEmpty()) {
            console.log(result);
            res.send(result.array());
        }
        else {
            database.update({'email':req.session.passport.user[0].email},
                {'education.sec':{
                    "school": school.capitalize(),
                    "compeletion": completion,
                    "board": board.capitalize(),
                    "performance": performance,
                    "scale": scale
                }},
                'users',function(result){
                    console.log(result);
                    console.log(req.session.passport.user[0].email);
                });
            res.send('Address details add in your account');
        }
    });
    res.send('Successfully save');
});

app.post('/sen_secondary_details',function(req,res){
    var completion = req.body.completion;
    var scale = req.body.scale;
    var board = req.body.board;
    var performance = req.body.performance;
    var school = req.body.school;
    req.checkBody('completion','Invalid year of completion').notEmpty();
    req.checkBody('school','Invalid school').notEmpty();
    req.checkBody('board','Invalid board').notEmpty();
    req.checkBody('performance','Invalid performance').notEmpty();
    req.checkBody('scale','Invalid scale').notEmpty();
    req.getValidationResult().then(function(result) {
        if (!result.isEmpty()) {
            console.log(result);
            res.send(result.array());
        }
        else {
            database.update({'email':req.session.passport.user[0].email},
                {'education.sen_sec':{
                    "school": school.capitalize(),
                    "compeletion": completion,
                    "board": board.capitalize(),
                    "performance": performance,
                    "scale": scale
                }},
                'users',function(result){
                    console.log(result);
                    console.log(req.session.passport.user[0].email);
                });
            res.send('Senior secondary details add in your account');
        }
    });
});
// // {college:$('#graduation-school').val(),start:$('#grad-start-year').val(),end:$('#grad-end-year').val(),scale:$('#grad-scale').val(),performance:$('#grad-performance').val(),degree:$('#grad-degree').val()}
app.post('/graduation_details',function(req,res){
    var college = req.body.college;
    var start = req.body.start;
    var end = req.body.end;
    var performance = req.body.performance;
    var scale = req.body.scale;
    var degree = req.body.degree;
    req.checkBody('degree','Invalid degree').notEmpty();
    req.checkBody('college','Invalid college name').notEmpty();
    req.checkBody('start','Invalid start date').notEmpty();
    req.checkBody('end','Invalid end date').notEmpty();
    req.checkBody('performance','Invalid performance').notEmpty();
    req.checkBody('scale','Invalid scale').notEmpty();
    req.getValidationResult().then(function(result) {
        if (!result.isEmpty()) {
            console.log(result);
            res.send(result.array());
        }
        else {
            database.update({'email':req.session.passport.user[0].email},
                {'education.grad':{
                    "school": college.capitalize(),
                    "start": start,
                    "end": end,
                    "performance": performance,
                    "scale": scale,
                    "degree": degree.capitalize()
                }},
                'users',function(result){
                    console.log(result);
                    console.log(req.session.passport.user[0].email);
                });
            res.send('Graduation details add in your account');
        }
    });
});
//
app.post('/post_graduation_details',function(req,res){
    var college = req.body.college;
    var start = req.body.start;
    var end = req.body.end;
    var performance = req.body.performance;
    var scale = req.body.scale;
    var degree = req.body.degree;
    req.checkBody('degree','Invalid degree').notEmpty();
    req.checkBody('college','Invalid college name').notEmpty();
    req.checkBody('start','Invalid start date').notEmpty();
    req.checkBody('end','Invalid end date').notEmpty();
    req.checkBody('performance','Invalid performance').notEmpty();
    req.checkBody('scale','Invalid scale').notEmpty();
    req.getValidationResult().then(function(result) {
    if (!result.isEmpty()) {
        console.log(result);
        res.send(result.array());
    }
    else {
        database.update({'email':req.session.passport.user[0].email},
            {'education.post':{
                "school": college.capitalize(),
                "start": start,
                "end": end,
                "performance": performance,
                "scale": scale,
                "degree": degree.capitalize()
            }},
            'users',function(result){
                console.log(result);
                console.log(req.session.passport.user[0].email);
            });
        res.send('Graduation details add in your account');
    }
});
});

app.post('/phd_details',function(req,res){
    var college = req.body.college;
    var start = req.body.start;
    var end = req.body.end;
    var performance = req.body.performance;
    var scale = req.body.scale;
    var degree = req.body.degree;
    console.log(scale);
    req.checkBody('degree','Invalid degree').notEmpty();
    req.checkBody('college','Invalid college name').notEmpty();
    req.checkBody('start','Invalid start date').notEmpty();
    req.checkBody('end','Invalid end date').notEmpty();
    req.checkBody('performance','Invalid performance').notEmpty();
    req.checkBody('scale','Invalid scale').notEmpty();
    req.getValidationResult().then(function(result) {
        if (!result.isEmpty()) {
            console.log(result);
            res.send(result.array());
        }
        else {
            database.update({'email':req.session.passport.user[0].email},
                {'education.phd':{
                    "school": college.capitalize(),
                    "start": start,
                    "end": end,
                    "performance": performance,
                    "scale": scale,
                    "degree": degree.capitalize()
                }},
                'users',function(result){
                    console.log(result);
                    console.log(req.session.passport.user[0].email);
                });
            res.send('PhD details add in your account');
        }
    });
});

app.post('/training_details',function(req,res){
   var program = req.body.program;
   var start = req.body.start;
   var end = req.body.end;
   var description = req.body.description;
   var organization = req.body.organization;
   var location = req.body.location;
   req.checkBody('program','Invalid degree').notEmpty();
   req.checkBody('start','Invalid start date').notEmpty();
   req.checkBody('end','Invalid end date').notEmpty();
   req.checkBody('organization','Invalid performance').notEmpty();
   req.checkBody('location','Invalid scale').notEmpty();
    req.getValidationResult().then(function(result) {
        if (!result.isEmpty()) {
            console.log(result);
            res.send(result.array());
        }
        else {
            database.push({'email':req.session.passport.user[0].email},
                {'experience.training':{
                    "program": program.capitalize(),
                    "start": start,
                    "end": end,
                    "organization": organization.capitalize(),
                    "location": location.capitalize(),
                    "description": description
                    }
                },
                'users',function(result){
                    console.log(result);
                    console.log(req.session.passport.user[0].email);
                });
            res.send('training details add in your account');
        }
    });
});

app.post('/intern_details',function(req,res){
    var profile = req.body.profile;
    var start = req.body.start;
    var end = req.body.end;
    var description = req.body.description;
    var organization = req.body.organization;
    var location = req.body.location;
    req.checkBody('profile','Invalid profile').notEmpty();
    req.checkBody('start','Invalid start date').notEmpty();
    req.checkBody('end','Invalid end date').notEmpty();
    req.checkBody('organization','Invalid performance').notEmpty();
    req.checkBody('location','Invalid scale').notEmpty();
    req.getValidationResult().then(function(result) {
        if (!result.isEmpty()) {
            console.log(result);
            res.send(result.array());
        }
        else {
            database.push({'email':req.session.passport.user[0].email},
                {'experience.intern':{
                    "profile": profile.capitalize(),
                    "start": start,
                    "end": end,
                    "organization": organization.capitalize(),
                    "location": location.capitalize(),
                    "description": description
                }
                },
                'users',function(result){
                    console.log(result);
                    console.log(req.session.passport.user[0].email);
                });
            res.send('Internship details add in your account');
        }
    });
});

app.post('/job_details',function(req,res){
    var profile = req.body.profile;
    var start = req.body.start;
    var end = req.body.end;
    var description = req.body.description;
    var organization = req.body.organization;
    var location = req.body.location;
    req.checkBody('profile','Invalid profile').notEmpty();
    req.checkBody('start','Invalid start date').notEmpty();
    req.checkBody('end','Invalid end date').notEmpty();
    req.checkBody('organization','Invalid performance').notEmpty();
    req.checkBody('location','Invalid scale').notEmpty();
    req.getValidationResult().then(function(result) {
        if (!result.isEmpty()) {
            console.log(result);
            res.send(result.array());
        }
        else {
            database.push({'email':req.session.passport.user[0].email},
                {'experience.job':{
                    "profile": profile.capitalize(),
                    "start": start,
                    "end": end,
                    "organization": organization.capitalize(),
                    "location": location.capitalize(),
                    "description": description
                }
                },
                'users',function(result){
                    console.log(result);
                    console.log(req.session.passport.user[0].email);
                });
            res.send('Internship details add in your account');
        }
    });
});

app.post('/project_details',function(req,res){
    var title = req.body.title;
    var projectlink = req.body.projectlink;
    var description = req.body.description;
    req.checkBody('title','Invalid title').notEmpty();
    req.checkBody('projectlink','Invalid projectlink').notEmpty();
    req.getValidationResult().then(function(result) {
        if (!result.isEmpty()) {
            console.log(result);
            res.send(result.array());
        }
        else {
            database.push({'email':req.session.passport.user[0].email},
                {'experience.project':{
                    "title": title.capitalize(),
                    "projectlink": projectlink,
                    "description": description
                }
                },
                'users',function(result){
                    console.log(result);
                    console.log(req.session.passport.user[0].email);
                });
            res.send('Internship details add in your account');
        }
    });
});

app.post('/skill_details',function(req,res){
    var skill = req.body.skill;
    var skill_level = req.body.skill_level;
    req.checkBody('skill','Invalid skill').notEmpty();
    req.checkBody('skill_level','Invalid level').notEmpty();
    req.getValidationResult().then(function(result) {
        if (!result.isEmpty()) {
            console.log(result);
            res.send(result.array());
        }
        else {
            database.push({'email':req.session.passport.user[0].email},
                {'skills':{
                    "skill": skill.capitalize(),
                    "level": skill_level
                }
                },
                'users',function(result){
                    console.log(result);
                    console.log(req.session.passport.user[0].email);
                });
            res.send('Skills details add in your account');
        }
    });
});

app.post('/upload', function(req, res) {
    if (!req.files)
        return res.status(400).send('No files were uploaded.');
    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    var sampleFile = req.files.sampleFile;
    // console.log(fileUpload.send('./image/file.jpg'))
    // operation('INSERT INTO image values(1,'+sampleFile.data+')')
    // Use the mv() method to place the file somewhere on your server

    sampleFile.mv('./image/'+req.session.passport.user[0].email+'.jpg', function(err) {
        if (err)
            return res.status(500).send(err);
        res.redirect('/resume');
    });
});

app.get('/image.png', function (req, res) {
    fs.stat(path.resolve('./image/'+req.session.passport.user[0].email+'.jpg'),function(err,stat){
        if(err === null) {
            res.sendFile(path.resolve('./image/'+req.session.passport.user[0].email+'.jpg'));
        }
        else if(err.code) {
            res.sendFile(path.resolve('./image/default.png'));
        }
    });
});


app.post('/all',function(req,res){
    database.get({'email':req.session.passport.user[0].email},'users',function(result){
        res.send(result);
    });
});

app.post('/train_delete',function(req,res) {
    var index = req.body.index;
    var data1 = {};
    data1["experience.training." + index] = 1;
    database.delete_element(req.session.passport.user[0].email, data1, function (result) {
        res.send(result);
    });
});

app.post('/intern_delete',function(req,res) {
    var index = req.body.index;
    var data1 = {};
    data1["experience.intern." + index] = 1;
    database.delete_element(req.session.passport.user[0].email, data1, function (result) {
        res.send(result);
    });
});

app.post('/job_delete',function(req,res) {
        var index = req.body.index;
        var data1 = {};
        data1["experience.job."+index]=1;
        database.delete_element(req.session.passport.user[0].email,data1, function (result) {
            res.send(result);
        });

});

app.post('/update_training_details',function(req,res){
    var el = req.body.el;
    var program = req.body.program;
    var start = req.body.start;
    var end = req.body.end;
    var description = req.body.description;
    var organization = req.body.organization;
    var location = req.body.location;
    req.checkBody('program','Invalid degree').notEmpty();
    req.checkBody('start','Invalid start date').notEmpty();
    req.checkBody('end','Invalid end date').notEmpty();
    req.checkBody('organization','Invalid performance').notEmpty();
    req.checkBody('location','Invalid scale').notEmpty();
    req.getValidationResult().then(function(result) {
        if (!result.isEmpty()) {
            console.log(result);
            res.send(result.array());
        }
        else {
            var data2 = {};
            data2['experience.training.'+el] = {"program": program.capitalize(),
                "start": start,
                "end": end,
                "organization": organization.capitalize(),
                "location": location.capitalize(),
                "description": description};
            database.update({'email':req.session.passport.user[0].email},
                data2,
                'users',function(result){
                    console.log(result);
                    console.log(req.session.passport.user[0].email);
                });
            res.send('done');
        }
    });
});

app.post('/update_intern_details',function(req,res){
    var el = req.body.el;
    var program = req.body.program;
    var start = req.body.start;
    var end = req.body.end;
    var description = req.body.description;
    var organization = req.body.organization;
    var location = req.body.location;
    req.checkBody('program','Invalid degree').notEmpty();
    req.checkBody('start','Invalid start date').notEmpty();
    req.checkBody('end','Invalid end date').notEmpty();
    req.checkBody('organization','Invalid performance').notEmpty();
    req.checkBody('location','Invalid scale').notEmpty();
    req.getValidationResult().then(function(result) {
        if (!result.isEmpty()) {
            console.log(result);
            res.send(result.array());
        }
        else {
            var data2 = {};
            data2['experience.intern.'+el] = {"profile": program.capitalize(),
                "start": start,
                "end": end,
                "organization": organization.capitalize(),
                "location": location.capitalize(),
                "description": description};
            database.update({'email':req.session.passport.user[0].email},
                data2,
                'users',function(result){
                    console.log(result);
                    console.log(req.session.passport.user[0].email);
                });
            res.send('done');
        }
    });
});

app.post('/update_job_details',function(req,res){
    var el = req.body.el;
    var program = req.body.program;
    var start = req.body.start;
    var end = req.body.end;
    var description = req.body.description;
    var organization = req.body.organization;
    var location = req.body.location;
    req.checkBody('program','Invalid degree').notEmpty();
    req.checkBody('start','Invalid start date').notEmpty();
    req.checkBody('end','Invalid end date').notEmpty();
    req.checkBody('organization','Invalid performance').notEmpty();
    req.checkBody('location','Invalid scale').notEmpty();
    req.getValidationResult().then(function(result) {
        if (!result.isEmpty()) {
            console.log(result);
            res.send(result.array());
        }
        else {
            var data2 = {};
            data2['experience.job.'+el] = {"profile": program.capitalize(),
                "start": start,
                "end": end,
                "organization": organization.capitalize(),
                "location": location.capitalize(),
                "description": description};
            database.update({'email':req.session.passport.user[0].email},
                data2,
                'users',function(result){
                    console.log(result);
                    console.log(req.session.passport.user[0].email);
                });
            res.send('done');
        }
    });
});

database.connectionDB(function(){
    app.listen(process.env.PORT||5000,function(err){
        if(err) throw err;
        console.log("server is running on 5000");
    });
});


