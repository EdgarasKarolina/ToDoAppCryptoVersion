var express = require('express');//web app framework for nodejs
var passport = require('passport');//
var Account = require('../models/userAccount');//requiring Account model
var Message = require('../models/message');//requiring Message model
var bodyParser = require('body-parser');//extracts the entire body portion body portion of an incoming request stream
// and exposes it on req.body as something easier to interface with
var mongoose = require('mongoose');
var ObjectId = require('mongodb').ObjectID;
//requiring for file with Java Script functions
var greetings = require("../javascript/functions");
var path = require('path');//provides utilities for working with file and directory paths

const crypto2 = require('crypto2'); //requiring crypto2 library

var router = express();

router.set('views', path.join(__dirname, '../views'));//setting path to views folder
router.set('view engine', 'jade');
router.use(express.static(path.join(__dirname, '../public')));

var privateKeyFinished;
var publicKeyFinished;
var encryptedMessage;
var decryptedMessage;

var receiversPublicKey;
var encryptedMessageToReceiver;

var receiversPrivateKey;
var decryptedMessageToReceiver;

var clearMessages = [];

var contents = [];




router.get('/', (req, res) => {
    res.render('loginView', { user : req.user });
}); 

//GET register view
router.get('/register', (req, res) => {

    crypto2.createKeyPair((err, privateKey, publicKey) => {
        privateKeyFinished = privateKey;
        publicKeyFinished = publicKey;
      });
    res.render('registerView', { });
});

//POST register view
router.post('/register', (req, res, next) => {
    var userName = greetings.checkUserNames(req.body.username);
    var passwordContainsNumber = greetings.checkPasswords(req.body.password);
    var passwordContainsUpperCase = greetings.containsUpperCases(req.body.password);

    if(userName && passwordContainsNumber && passwordContainsUpperCase)
    {  
        Account.register(new Account({ username : req.body.username, publicKey : publicKeyFinished, privateKey : privateKeyFinished }), req.body.password, (err, account) => {
            if (err) {
              return res.render('registerView', { error : err.message });
            }
            passport.authenticate('local')(req, res, () => {
                req.session.save((err) => {
                    if (err) {
                        return next(err);
                    }
                    res.redirect('/');
                });
            });
        });
    }
    else { res.render('registerView', { user : req.user }); }
});

//GET login view
router.get('/login', (req, res) => {
    res.render('loginView', { user : req.user, error : req.flash('error')});
});

//POST login view
router.post('/login', passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), (req, res, next) => {
    req.session.save((err) => {
        if (err) {
            return next(err);
        }

        contents = [];
        
        var vardas = req.user.username;
        var sudas = req.user.privateKey;
        console.log("privatus suda yra: " + sudas);

        Message.find({"username" : req.user.username}).distinct('content', function(error, ids) {
            var count;
            var messagesLenght = ids.length;
    
            for (count = 0; count < ids.length; count++) {            
                    crypto2.decrypt.rsa(ids[count], sudas, (err, decrypted) => { 
                        contents.push(decrypted);
                })                              
            }       
    });



        res.redirect('/');
    });
});

//logout view
router.get('/logout', (req, res, next) => {
    req.logout();
    req.session.save((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
});




router.get('/encryptedFeed', (req , res) =>{

    res.render('decryptedfeedView',{messages: contents, user : req.user})
  
 });


 //GET feed view by logged in user
 router.get('/feed',(req , res) =>{
    Message.find({"username" : req.user.username}, function(err , i){
        if (err) return console.log(err)  

        res.render('feedView',{messages: i, user : req.user})  
     })
 });

 //GET important ToDo view by logged in user
router.get('/importantToDo',(req , res) =>{
    Message.find({"username" : req.user.username, "importance" : "Important"}, function(err , i){
        if (err) return console.log(err)

        res.render('feedView',{messages: i, user : req.user})  
     })
 }); 

//GET not important ToDo view by logged in user
router.get('/notImportantToDo',(req , res) =>{
    Message.find({"username" : req.user.username, "importance" : "Notimportant"}, function(err , i){
        if (err) return console.log(err)
        res.render('feedView',{messages: i, user : req.user})  
     })
 }); 

 //GET create ToDo view
router.get('/createToDo', (req, res) => {
    res.render('createToDoView', { user : req.user, user : req.user });
});

//POST create ToDo view
router.post('/createToDo',(req, res, next) => {
    var isMessageMax60 = greetings.maximum60Characters(req.body.content);
    var isNotEmpty = greetings.isNotEmpty(req.body.content);
if(isMessageMax60 && isNotEmpty)
{
   var message = new Message()
   message.username = req.body.username
   message.content = req.body.content
   message.importance = req.body.importance
   var dt1 = new Date();
   message.date = dt1
   message.save(req.body, function(err, data) {

    Message.find({"username" : req.user.username}, function(err, i) {
        if (err) return console.log(err) 

            res.render('feedView', {messages: i, user : req.user})
    });
   }); 
}
   else {
    res.render('createToDoView', { user : req.user, user : req.user });
   }
});

//GET send ToDO to another user
router.get('/sendToDo',(req , res) =>{
    Account.find(function(err , i){
        if (err) return console.log(err)

        res.render('sendToDoView',{accounts: i, user : req.user})  
     })
 });


router.post('/sendToDo',(req, res, next) => {
 
    Account.findOne({ "username" : req.body.username}, function (err, doc){
     receiversPublicKey = doc.publicKey;
     console.log("receiversPublicKey: " + receiversPublicKey);

     crypto2.encrypt.rsa(req.body.content, receiversPublicKey, (err, encrypted) => {
        encryptedMessageToReceiver = encrypted;
        console.log("encrypted message: " + encryptedMessageToReceiver );
     
        Account.findOne({ "username" : req.body.username}, function (err, doc){
            receiversPrivateKey = doc.privateKey;
            console.log("receiversPrivateKey: " + receiversPrivateKey);
 
    var message = new Message()
    message.username = req.body.username
    message.content = encryptedMessageToReceiver
    message.importance = req.body.importance
    var dt1 = new Date();
    message.date = dt1

    crypto2.decrypt.rsa(encryptedMessageToReceiver, receiversPrivateKey, (err, decrypted) => {
        decryptedMessageToReceiver = decrypted;
        console.log("dencrypted message: " + decryptedMessageToReceiver );
      
    message.save(req.body, function(err, data) {
     Message.find({"username" : req.user.username}, function(err, i) {
         if (err) return console.log(err) 
 
             res.render('feedView', {messages: i, user : req.user})     
            });
            });
            });
            });
     });
    });
 });


//delete message
router.delete('/messages/:id',(req , res) =>{   
    console.log(req.params.id)   
      Message.remove({"_id": ObjectId(req.params.id)}, function(err, result){
        if (err) {
          console.log(err);
        }   
      });      
     });



module.exports = router;