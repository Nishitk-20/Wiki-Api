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

app.listen(port, function () {
    console.log("Server started on port " + port);
});