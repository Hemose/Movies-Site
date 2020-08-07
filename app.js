const express = require('express')
const app = express()
const path=require('path')
const bodyParser =require('body-parser') 
const fs = require('fs')
var session = require('express-session')
var contains = require("string-contains");
app.use(session({secret:'ssshhhhhh'}))

app.use(express.static('public'))
app.set('view engine','ejs')
app.set('views',path.join(__dirname,'views'))
app.use(bodyParser.urlencoded({ extended: false }))
app.get('/',function(req,res) {
    res.render('login',{err:""})
    

})
app.get('/registration',function(req,res) {
    res.render('registration',{err: ""})

})
app.post('/',function(req,res){  
    
    let users = loadUSers()
    user = {username:req.body.username,password:req.body.password}
     req.session.username=req.body.username;
       for(var i=0;i<=users.length-1;i++){
         if(users[i].username==user.username&&users[i].password==user.password){
              res.redirect('/home');
              return;
 }
       }
      res.render('login',{err: "Wrong username or password"})
})
// /registration
app.get('/home',function(req,res) {
    res.render('home',{})

})

// /drama
app.get('/drama',function(req,res) {
    res.render('drama',{
       
    })

})
// /godfather
app.get('/godfather',function(req,res) {
    res.render('godfather',{err:""})

})
// /godfather2
app.get('/godfather2',function(req,res) {
    res.render('godfather2',{err:"" })

})
//horror
app.get('/horror',function(req,res) {
    res.render('horror',{
       
    })
})
//scream
app.get('/scream',function(req,res) {
    res.render('scream',{err:""})
})
//conjuring
app.get('/conjuring',function(req,res) {
    res.render('conjuring',{err:""})
})
//action
app.get('/action',function(req,res) {
    res.render('action',{})
})

//fightclub
app.get('/fightclub',function(req,res) {
    res.render('fightclub',{err:""})
})

//darkknight
app.get('/darkknight',function(req,res) {
    res.render('darkknight',{err:""})
})

// /watchlist
app.get('/watchlist',function(req,res) {
    let users = loadUSers()
    var Wlist =[];
       for(var i=0;i<=users.length-1;i++){
         if(users[i].username==req.session.username){
             Wlist=users[i].watchlist;
             break
             }
       }
       var matching = [];
       var links=[];
          for(var i=0;i<=Wlist.length-1;i++){
               matching.push("/"+Wlist[i]+".jpg");
               links.push("/"+Wlist[i])
           
          }
    res.render('watchlist',{result:matching,link:links});
})



let loadUSers = function(){
    try {
        let bufferedData = fs.readFileSync('users.json')
        let dataString = bufferedData.toString()
        let usersArray = JSON.parse(dataString)
        return usersArray
    } catch (error) {
        return []
    }
}
let loadMovies = function(){
    try {
        let bufferedData = fs.readFileSync('Movie.json')
        let dataString = bufferedData.toString()
        let usersArray = JSON.parse(dataString)
        return usersArray
    } catch (error) {
        return []
    }
}

let addUser = function(u=(username,password)){
    let users = loadUSers()
    users.push(u)
    fs.writeFileSync('users.json', JSON.stringify(users))
}

app.post('/register',function(req,res){
   let users = loadUSers()
   user = {username:req.body.username,password:req.body.password,watchlist:[]}
    
      for(var i=0;i<=users.length-1;i++){
        if(users[i].username==req.body.username){
            res.render('registration',{err: "USERNAME ALREADY EXISTS!!!"})
            return
            }
      }
    addUser(user)
    res.render('registration',{err: "registration was successfull"})
    }
 //res.render('home',{users: loadUSers()})

)
//app.post('/register', function(req,res){
  //  addUser(req.body.users)
   // res.redirect('/home')
//})
app.get('/', function(req,res){
    res.render('home',{
       users : loadUSers()
    })
})


//whatch list generating and checking
app.post('/watch',function(req,res){
    let users = loadUSers()
    var Wlist =[];
    var z = 0;  
       for(var i=0;i<=users.length-1;i++){
         if(users[i].username==req.session.username){
             Wlist=users[i].watchlist;
             z=i;
             break
             }
       }
       
       for(var i=0;i<=Wlist.length-1;i++){
        if(Wlist[i]==req.body.btn){
            res.render(Wlist[i],{err:"The movie already in the watchist"});
            return;
        }
      }
      users[z].watchlist.push(req.body.btn);
      fs.writeFileSync('users.json', JSON.stringify(users))
      res.render(req.body.btn,{err:"Done !!"})
     }
    
 
 )
 // searching and finding movies 
 app.post('/search',function(req,res){
    let movies = loadMovies();
    var matching = [];
    var links=[];
       for(var i=0;i<=movies.length-1;i++){
         if(contains(movies[i],req.body.Search.toLowerCase())){
            matching.push("/"+movies[i]+".jpg");
            links.push("/"+movies[i]);
        }
       }
       res.render('searchresults',{result:matching,link:links});
    }
 )

app.listen(3000)