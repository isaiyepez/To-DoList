//jshint esversion:6

const express = require("express");
const mongoose = require("mongoose");
const lodash = require("lodash");

const date = require(__dirname + "/date.js");

const app = express();

// Seems crazy, but you can define this as constant.
// in JS, you can push new items to the array,
// and also can change the value of an item, but
// you can't assign a new array value (e.g. tasks = workItems will not work)


//You must use this line of code below express variable def.
app.set('view engine', 'ejs');
app.use(express.urlencoded({
    extended: true
}));

//To make express to serve up the public folder:
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-isai:antares155@cluster0.zgwrc.mongodb.net/todolistDB");

const itemsSchema = {
    Name: {
        type: String,
        required: true
    }
};

const Item = mongoose.model(
    "Item",
    itemsSchema
);

const item1 = new Item({
    Name: "Think of a cool app"
});

const item2 = new Item({
    Name: "Design a cool app"
});

const item3 = new Item({
    Name: "Code a cool app"
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}
app.listen(port);

let tasks = [item1, item2, item3];

const listSchema = new mongoose.Schema({
    name: String,
    items: [itemsSchema]
});

const List = mongoose.model("List", listSchema);

app.get("/", function (req, res) {

    let longDate = date.getDate();

    Item.find({}, function (err, foundItems) {
        if (err) {
            console.log(err);
        } else {
            if (foundItems.length === 0) {
                Item.insertMany(tasks, function (err) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("Successfully added default tasks!");
                        res.redirect("/");
                    }
                });
            } else {
                res.redirect("/" + longDate);
            }
        }
    });

});

app.post("/", function (req, res) {

    let newTask = req.body.task;
    let listName = req.body.list;

    const taskToAdd = new Item({
        Name: newTask
    });

        List.findOne({name: listName}, function(err, foundList){
            console.log(foundList);
            foundList.items.push(taskToAdd);
            foundList.save();
            res.redirect("/" + listName);
        });
});

app.post("/delete", function (req, res) {

    const checkedItemId = req.body.checkbox;
    const listName = req.body.listName;

    List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}}, function(err, foundList) {
        if(!err){
            res.redirect("/" + listName);
        } else {
            console.log(err);
        }
    });
});

app.get("/:customListName", function(req, res) {

    const customListName = lodash.capitalize(req.params.customListName);    

    List.findOne({name: customListName}, function(err, foundList) {
            if (err) {
                console.log(err);
            } else {
                if (!foundList) {                    

                    const list = new List({
                        name: customListName,
                        items: tasks
                    });

                    list.save();
                    res.redirect("/" + customListName);
                } else {
                    
                    res.render("list", {
                        listTitle: foundList.name,
                        listItems: foundList.items
                    });
                }
            }
        });
});