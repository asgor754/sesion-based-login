const express = require('express')
const  cors = require('cors')
const ejs = require('ejs')
require('dotenv').config()
require('./config/passport')
const app = express()
const bcrypt = require('bcrypt')
const passport = require('passport')
const session = require('express-session')
const mongoStore = require('connect-mongo')
const salt = 10
const User = require('./models/user.model')
const { JSONCookie } = require('cookie-parser')

app.set('view engine','ejs')
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized:true,
    cookie:{
        secure:false,
        path:'/',
        maxAge:600000,
        encode:JSONCookie
    },
    store: mongoStore.create({
        mongoUrl :process.env.MONGOBD_URL,
        collectionName: 'record'
    })
}))
app.use(passport.initialize())
app.use(passport.session())

app.get('/',(req,res)=>{
    res.render('index')
})

// register get 
app.get('/register',(req,res)=>{
    res.render('register')
})
// register post 
app.post('/register',async(req,res)=>{
    try{
        const user = await User.findOne({username: req.body.username})
        if(user) return res.status(400).send('user already exists')
         const hash = await bcrypt.hash(req.body.password,salt)
         const body = {
            username: req.body.username,
            password: hash
         }
        const newuser = User(body)
        await newuser.save()
        res.status(201).redirect('/login')
    }catch(err){
        res.status(500).send(err.massage)
    }
})

const checkLoggedIn = (req,res,next)=>{
    if(req.isAuthenticated()){
        return res.redirect('/profile')
    }
    next()
}
// login get
app.get('/login',checkLoggedIn,(req,res)=>{
    res.render('login')
})
// login post 
app.post('/login',passport.authenticate('local',{
    failureRedirect: '/login',
    successRedirect:'/profile',
    successMessage:'you are successfully logged in '
}))
// profile with athuentication
const checkAuthenticated = (req,res,next)=>{
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect('/login')
}

app.get('/profile',checkAuthenticated,(req,res)=>{
   res.render('profile')
})

// logout page
app.get('/logout',(req,res)=>{
    try{
        req.logOut((err)=>{
            if(err){
                return next(err)
            }
            res.redirect('/')
        })
    }catch(err){
            res.status(500).send(err.massage)
    }
})
module.exports= app