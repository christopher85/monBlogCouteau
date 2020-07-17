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
const path = require('path');


const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './public/uploads')
    },
    filename: function(req, file, cb){

        const ext = path.extname(file.originalname);
        const date = Date.now();

        cb(null, file.originalname+ '-' + date + ext)
    }
}) 
const upload = multer({ 
    storage: storage,
    limits:{
        // fileSize: 20,
        files:1
    },
    fileFilter: function(req, file, cb){
        if (file.mimetype === "image/png" ||
            file.mimetype === "image/jpeg" ||
            file.mimetype === "image/gif"
            ){
                cb(null, true)
            }else{
                cb(new Error("Le fichier doit être au format png, jpeg, gif."))
            }
    }



});


const app = express();

// Handlebars
app.engine("hbs", exphds({defaultLayout: "main",extname: "hbs",handlebars: allowInsecurePrototypeAccess(Handlebars)}));

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
    category: {type: mongoose.Schema.Types.ObjectId, ref: "category"},
    cover: {
        name: String,
        originalName: String,
        path: String,
        urlSharp: String,
        createAt: Date

    },
})
const categorySchema = new mongoose.Schema({
    title: String,
}) 


const Product = mongoose.model("product", productSchema);
const Category = mongoose.model("category",categorySchema)

//route category

app.route('/category')
    .get((req,res) => {
        Category.find((err, category) =>{
            if(!err){
                res.render("category",{
                    category: category
                })
            }else{
                res.send(err)
            }
        })
    })
    .post((req, res) => {
        const newCategory = new Category({
            title: req.body.title,
        })
        newCategory.save(function(err){
            if(!err){
                res.send("category save")
            }else{
                res.send(err)
            }
        })
    })

//route GET

app.route('/get')
    .get((req, res) => {
        Product
        .find()
        .populate("category")
        .exec(
            (err, product) => {

                // console.log("product", product);

                if (!err) {
                    res.render("get", {
                    product: product,          
                })
                } else {
                    res.send(err)
                }
            }
        )
    })

//METHODE POST

app.route('/post')
    .get((req, res) => {
        Product
        .find()
        .populate("category")
        .exec((err, product) => {
            if (!err) {
                Category.find(function(err, category){
                    res.render("post", {
                    product: product,
                    category: category,
                    }) 
                })
            } else {
                res.send(err)
            }
        })

    })
    .post(upload.single("cover"),(req, res) => {
        const file = req.file;
        console.log(file);
        

        const newProduct = new Product({
            category: req.body.category,
            title: req.body.title,
            content: req.body.content,
            cover: req.body.cover,
        });
        if(file){
            newProduct.cover = {
                name: file.filename,
                originalname: file.originalname,
                path: file.path.replace("public", ""),
                createAt: Date.now()
            }
        }
        newProduct.save(function (err) {
            if (!err) {
                res.redirect("/get")
            } else {
                res.send(err)
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
                    res.send(err)
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
                    res.send(err)
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
                    res.redirect('/get')
                }else {
                    res.send(err)
                }
            }
        )
    })


app.listen(1985, function () {
    console.log(`écoute le port 1985,  lancé à:${new Date().toLocaleString()}`);

})