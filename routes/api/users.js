const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const shortid = require('shortid');
var config = require('../../config');

const gravatar = require('gravatar');
// Load input validation

// Load User model
const User = require("../../models/User");
const Post =require("../../models/Post");
// @route POST api/users/register
// @desc Register user
// @access Public

router.post("/register", (req, res) => {
  const email = req.body.email;
// Find user by email
  User.findOne({ email }).then(user => {
    // Check if user exists
    if (user) {
      return res.status(404).json({ userexist: "user exist with the same email" });
    }
  });
var id =shortid.generate();
var avatar = gravatar.url('req.body.email', {s: '200', r: 'pg', d: 'mm'});
const newUser = new User({
        id,
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        
        firstname:req.body.firstname,
        lastname:req.body.lastname,
        userlevel:req.body.userlevel,
        avatar,
      });
// Hash password before saving in database
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    });
  // @route POST api/users/login
// @desc Login user and return JWT token
// @access Public
router.post("/login", (req, res) => {


const email = req.body.email;
  const password = req.body.password;
// Find user by email
  User.findOne({ email }).then(user => {
    // Check if user exists
    if (!user) {
      return res.status(404).json({ emailnotfound: "Email not found" });
    }
// Check password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // User matched
        // Create JWT Payload
        const payload = {
          id: user.id,
          name: user.name
        };
// Sign token
     const token = jwt.sign(
          payload,
          keys.secretOrKey,
          
          {
            expiresIn: 31556926 // 1 year in seconds
          },
          (err, token) => {
            res.json({
              success: true,
              token:token
            });
          }
        );
      } else {
        return res  
          .status(400)
          .json({ passwordincorrect: "Password incorrect" });
      }
    });
  });
});

router.post("/logout", (req, res) => {
  payload={
    "sub": "1234567890",
    "name": "John Doe",
    "admin": true
  }
  const token = jwt.sign(
    payload,
    keys.logoutkey,
    
    
    {
      expiresIn: 31556926 // 1 year in seconds
    },
    (err, token) => {
      res.json({
        success: true,
        token:token
      });
    }
  );
} );
  


router.post("/post", (req, res) => {
  var token = req.headers['token'];
  var postid =shortid.generate();
  if (!token)
    return res.status(403).send({ auth: false, message: 'No token provided.' });
  jwt.verify(token, keys.secretOrKey, function(err, decoded) {
    if (err){
    return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    // if everything good, save to request for use in other routes
    req.userId = decoded.id;
    }
    else{
      console.log("success");
      const newPost = new Post({
        postid:postid,
        title: req.body.title,
        content: req.body.content,
        remarks:req.body.remarks
      });
      newPost
            .save()
            .then(post => res.json(post))
            .catch(err => console.log(err));
    }
  });
} );   
 
router.get("/getuser", (req, res) => {


  const email = req.body.email;
   
  
    User.findOne({ email }).then(user => {
      // Check if user exists
      if (!user) {
        return res.status(404).json({ emailnotfound: "Email not found" });
      }
          const payload = {
            id: user.id,
            name: user.name,
            firstname:user.firstname,
            lastname:user.lastname,
            email:user.email,
          };
 
        console.log(payload); 
        res.json({
          success: true,
          payload:payload
        });
    });
  });
  
  
  module.exports = router;