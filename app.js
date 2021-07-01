
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs")
const date = require(__dirname+"/date.js");
const mongoose = require("mongoose");
const _ = require("lodash")

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"))
mongoose.connect('mongodb+srv://admin-vinuka:vinuka13@cluster0.cz3xp.mongodb.net/to-do-list', {useNewUrlParser: true, useUnifiedTopology: true});


const itemsShema = new mongoose.Schema({
  item: String
});

const Item = mongoose.model("Item", itemsShema );

const item1 = new Item({
 item: "Hit + button to add new item"
})

const item2 = new Item({
  item: "<--- hit this to delete an item"
});

const listSchema = new mongoose.Schema({
  listName: String,
  listItem: [itemsShema]
});

const List = mongoose.model("List", listSchema);


app.get("/", function(req, res) {

  Item.find({}, function(err, docs){

    if(docs.length === 0){
      Item.insertMany([item1, item2], function(){
          console.log("items deployed");
          res.redirect('/');
        });
    } else {
        var kindofday = date.getdate();
        res.render("list", {title : kindofday, listitem: docs })
      }})
});



app.post("/", function(req, res){
  var itemName = req.body.list;
  var listTitle = req.body.button;

  const newItem = new Item({
    item: itemName
  })

  if(listTitle === date.getdate()){
    newItem.save();
    res.redirect('/')
  } else {
    List.findOne({listName: listTitle}, function(err, docs){
      docs.listItem.push(newItem);
      docs.save()
      res.redirect("/" + listTitle)
    })
  }
});

app.post("/delete", function(req, res){
  var checkedItemId = req.body.checkbox;
  var checkTitle = req.body.listname;

  if(checkTitle === date.getdate()){
    Item.deleteOne({_id: checkedItemId}, function(err){
      if(err){
        console.log(err)
      } else {
        console.log("Item deleted")
      }
    });
    res.redirect('/')
  } else {
    List.findOneAndUpdate({listName: checkTitle}, {$pull: {listItem: {_id: checkedItemId}}}, function(err, docs){
      if(err){
        console.log(err)
      } else {
         res.redirect("/" + checkTitle)
      }})

    }
  })

  app.post("/newList", function(req,res){
    var newPara = req.body.newList;
    res.redirect('/'+ newPara);
  })

app.get("/:paramName", function(req, res){
  var newListName = _.capitalize(req.params.paramName);

  List.findOne({listName: newListName}, function(err, docs){
    if(err){
      console.log(err)
    } else {
      if(docs) {
      //show the collection
      res.render("list", {title: docs.listName, listitem: docs.listItem})
      } else {
      //create new list document
        const newList = new List({
          listName: newListName,
          listItem: [item1, item2]
        });
        newList.save()
        res.redirect('/'+ newListName)
      }
    }
  })
})

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port, function(){
  console.log("sever is running")
})
