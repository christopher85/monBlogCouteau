const express = require('express');
const bodyParser = require('body-parser');
const Handlebars = require('handlebars');
const mongoose = require('mongoose');
const multer = require('multer');
const exphds = require('express-handlebars');
const {
    allowInsecurePrototypeAccess,
} = require('@handlebars/allow-prototype-access');
const methodOverride = require('method-override');


const app = express();

// Handlebars
app.engine("hbs", exphds({
    defaultLayout: "main",
    extname: "hbs",
    handlebars: allowInsecurePrototypeAccess(Handlebars)
}));

//method override
app.use(methodOverride("_method"));

//MongoDB
mongoose.connect("mongodb://localhost:27017/monBlogCouteau", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

app.set('view engine', 'hbs');

//body parser 
app.use(bodyParser.urlencoded({
    extended: true
}));

//static
app.use(express.static('public'));



const productSchema = new mongoose.Schema({
    title: String,
    content: String,
    category: String,
    cover: {
        name: String,
        originalName: String,
        path: String,
        urlSharp: String,
        createAt: Date

    },
})

const Product = mongoose.model("product", productSchema);

//route GET

app.route('/get')
    .get((req, res) => {
        Product.find((err, product) => {
            if (!err) {
                res.render("get", {
                product: product
                })
            } else {
                res.send('err')
            }
        })
    })
    .post()

//METHODE POST

app.route('/post')
    .get((req, res) => {
        res.render("post")

    })
    .post((req, res) => {
        const newProduct = new Product({
            title: req.body.title,
            content: req.body.content,
            category: req.body.category,
            cover: req.body.cover,
        });
        newProduct.save(function (err) {
            if (!err) {
                res.redirect("/get")
            } else {
                res.send('err')
            }
        })

    })

//MISE A JOUR

 app.route('/:id')
    .get((req, res) => {
        Product.findOne(
            {_id: req.params.id},
            function(err, product){
                if(!err){
                    res.render("put",{
                        _id: product.id,
                        title: product.title,
                        content: product.content,
                    })                    
                }else{
                    res.send('err1')
                }
            }   
        )    
    })
    .put(function(req, res){
        Product.update(
            //condition
            {_id: req.params.id},
            //update
            {
                title: req.body.title,
                content: req.body.content,
                cover: req.body.cover,
            },
            //option
            {multi:true},
            //execute
            function(err){
                if(!err){
                    res.redirect('/get')
                }else{
                    res.send('err')
                }
            }
    
        )
    })



//DELETE

    .delete(function(req,res){
        Product.deleteOne(
            {_id:req.params.id},
            function(err){
                if(!err){
                    res.send("product delete")
                }else {
                    res.send('err')
                }
            }
        )
    })


app.listen(1985, function () {
    console.log(`écoute le port 1985,  lancé à:${new Date().toLocaleString()}`);

})