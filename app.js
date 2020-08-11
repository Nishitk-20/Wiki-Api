//jshint esversion : 6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const port = 3000;

const app = express();
mongoose.connect("mongodb://localhost:27017/wikiDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

app.set('view-engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));

const articleSchema = new mongoose.Schema({
    title: String,
    content: String
});

const Article = mongoose.model("Article", articleSchema);


app.route("/articles")
    .get(function (req, res) {
        Article.find({}, function (err, foundArticles) {
            if (!err) {
                res.send(foundArticles);
            } else {
                res.send(err);
            }
        });
    })

    .post(function (req, res) {
        const a = new Article({
            title: req.body.title,
            content: req.body.content
        });
        a.save(function (err) {
            if (!err) {
                res.send("Successfully Posted");
            } else {
                res.send(err);
            }
        });
    })

    //to delete all the articles

    .delete(function (req, res) {
        Article.deleteMany({}, function (err) {
            if (!err) {
                res.send("Successfully deleted all the articles")
            } else {
                res.send(err);
            }
        })
    });

app.route("/articles/:articleTitle")

    .get(function(req,res){
        Article.findOne({title : req.params.articleTitle},function(err,foundArticle){
            if(!err){
                if(foundArticle){
                    res.send(foundArticle);
                }
                else{
                    res.send("No article with the given title");
                }
            }
            else{
                res.send(err);
            }
        })
    })

    .put(function(req,res){
        Article.updateOne(
            //condition
            {title:req.params.articleTitle}, 
            //Updates the title and content with new(which has been passed)
            {title : req.body.title, content: req.body.content}, 
            // {overwrite:true}, No need in updateOne function.
            function(err){
                if(!err){
                    res.send("Successfully updated");
                }
                else{
                    res.send(err);
                }         
            }
        )
    })  

    .patch(function(req,res){
        Article.updateOne(
            {title:req.params.articleTitle}, //condition
            {$set : req.body},//{title : req.params.title , content: req.params.content}}
            function(err){
                if(!err){
                    res.send("Succesfully Updated ");
                }
                else{
                    res.send(err);
                }
            }
        )
    })

    .delete(function(req,res){
        Article.deleteOne({title:req.params.articleTitle},function(err){
            if(!err){
                res.send("Deleted Succesfuly");
            }
            else{
                res.send(err);
            }
        })
    });


app.listen(port, function () {
    console.log("Server started on port " + port);
});