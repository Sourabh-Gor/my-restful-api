const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.set('strictQuery', true);

// mongoose.connect("mongodb://localhost:27017/wikiDB");
mongoose.connect("mongodb+srv://admin:admin@wikidb.olj6mfa.mongodb.net/?retryWrites=true&w=majority");

const articleSchema = mongoose.Schema({
    tittle: String,
    content: String
});

const Article = mongoose.model("Article" , articleSchema);


app.route("/articles")
    .get(async function(req,res){
        try{
        const foundArticles = await Article.find({});
        if(foundArticles){
            res.send(foundArticles);
        }}
        catch (error) {
            console.log(error);}
    })
    .post(async function(req , res){
        const newArticle = new Article({
            tittle: req.body.tittle,
            content: req.body.content
        })
        try{
        newArticle.save().then(savedDoc => {
            savedDoc === newArticle; // true
            res.send("No Errors, Successfully inserted article.");
          });
    }catch(err){
                res.send(err);
            }
        })
    .delete(function(req,res){
        Article.deleteMany({}).then(function(){
            res.send("Data deleted"); // Success
        }).catch(function(error){
            res.send(error); // Failure
        });
    });

app.route("/articles/:articleTittle")
    .get(function(req,res){
            const param = req.params.articleTittle;
            Article.findOne({tittle:  param}).then((docs)=>{
                if(docs){
                res.send(docs);
                }
                else{
                    res.send("Article with the tittle not found.");
                }
            })
            .catch((err)=>{
                console.log(err);
            });
            
    })
    .put(function(req,res){
        const filter = {tittle: req.params.articleTittle};
        const update = {tittle: req.body.tittle , content: req.body.content}
        Article.findOneAndUpdate(filter,update,{overwrite: true} ).then( docs => {
            res.send("Successfully Updated Article!");
        }).catch((err) => {
            console.log(err);
        });
    })
    .patch(function(req,res){
        const filter = {tittle: req.params.articleTittle};
        Article.findOneAndUpdate(filter,{$set: req.body},).then( docs => {
            res.send("Successfully Updated Article!");
        }).catch((err) => {
            console.log(err);
        });
    })
    .delete(function(req,res){
        Article.deleteOne({tittle: req.params.articleTittle}).then( docs => {
            res.send("Successfully Deleted!");
        }).catch((err) => {
            res.send(err);
            console.log(err);
        });
    });

app.get("/" , function(req,res){
    res.redirect("/articles");
});



app.listen(process.env.PORT||3000, function() {
    console.log("Server started on port 3000");
  });