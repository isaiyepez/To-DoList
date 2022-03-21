//jshint esversion:6

const express = require("express");
const date = require(__dirname + "/date.js");

const app = express();

// Seems crazy, but you can define this as constant.
// in JS, you can push new items to the array,
// and also can change the value of an item, but
// you can't assign a new array value (e.g. tasks = workItems will not work)
const tasks = [];
const workItems = [];

//You must use this line of code below express variable def.
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));

//To make express to serve up the public folder:
app.use(express.static("public"));

app.listen(3000, function() {
    console.log("Server started on port 3000");
});

app.get("/", function(req, res) {
    
    let longDate = date.getDate();    
    
    res.render("list", {listTitle: longDate, listItems: tasks})
});

app.post("/", function(req, res) {
    
    let newTask = req.body.task;

    if (req.body.list === "Work") {
        workItems.push(newTask);
        res.redirect("/work");
    } else {

        tasks.push(newTask);
        res.redirect("/");
    }

});

app.get("/work", function(req, res) {
    res.render("list", {listTitle: "Work List", listItems: workItems})
});

app.post("/work", function(req, res) {
    let item = req.body.newItem;
    workItems.push(item);
    res.redirect("/work");
})