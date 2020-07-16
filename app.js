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



const productSchema = new mongoose.Schema({
    title: String,
    content: String,
    cover: {
        name: String,
        originalName: String,
        path:String,
        urlSharp: String,
        createAt: Date

    },
})

const Product = mongoose.model("product", productSchema);

//route 
app.route('/acceuil')
.get((req, res) =>{
    Product.find((err,product) => {
        if(!err) {
            res.render("acceuil",{
                produit: product
            })
        }else{
            res.send(err)
        }
    })

})


.post((req, res) =>{
    const newProduct = new Product({
        title: req.body.title,
        content: req.body.content,
        price: req.body.price,
    });
    newProduct.save(function(err){
        if(!err){
            res.send("save ok !!!")
        }else{
            res.send(err)
        }
    })
    
})








app.listen(1985, function(){
    console.log(`écoute le port 1985,  lancé à:${new Date().toLocaleString()}`);
    
})

