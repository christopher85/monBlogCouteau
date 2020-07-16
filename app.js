const express = require('express');
const bodyParser = require('body-parser');
const Handlebars = require('handlebars');
const mongoose = require('mongoose');
const multer = require('multer');
const exphds = require('express-handlebars');
const {allowInsecurePrototypeAccess,} = require('@handlebars/allow-prototype-access');
const methodOverride = require('method-override');


const app = express();

// Handlebars
app.engine("hbs", exphds({defaultLayout: "main",extname: "hbs",
handlebars: allowInsecurePrototypeAccess(Handlebars)}));

//method override
app.use(methodOverride("_method"));

//MongoDB
mongoose.connect("mongodb://localhost:27017/boutiqueGame", {useNewUrlParser: true,useUnifiedTopology: true,});

app.set('view engine','hbs');

//body parser 
app.use(bodyParser.urlencoded({extended: true}));

//static
app.use(express.static('public'));


//route 
app.route('/acceuil')
.get((req, res) =>{
    res.render("acceuil")
})
.post((req, res) =>{
    // res.render("acceuil")
    // console.log();
    
})








app.listen(1985, function(){
    console.log(`écoute le port 1985,  lancé à:${new Date().toLocaleString()}`);
    
})

