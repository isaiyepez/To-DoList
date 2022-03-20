//jshint esversion:6

const express = require("express");

const app = express();
var tasks = [];

//You must use this line of code below express variable def.
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));

app.listen(3000, function() {
    console.log("Server started on port 3000");
});

app.get("/", function(req, res) {



    var today = new Date();
    var options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    };

    var day = today.toLocaleDateString("en-US", options);
    
    res.render("list", {kindOfDay: day, listItems: tasks})
});

app.post("/", function(req, res) {
    newTask = req.body.task;
    console.log(newTask);

    tasks.push(newTask);

    res.redirect("/");
});
