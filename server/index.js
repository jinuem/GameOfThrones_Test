const express = require('express')
const app = express()
const port = 4000
var cors = require('cors')
var bodyParser = require('body-parser');
app.use(cors())
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/mydb";

app.use(bodyParser.json({ type: 'application/*+json' }));
app.use(cors())

app.get('/all', (req, res) => {
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("mydb");
        dbo.collection("reviews").find({}).toArray(function(err, result) {
          if (err) throw err;
          console.log(result);
          res.send(result)
          db.close();
        });
      });
})

app.post('/submit',bodyParser.json(),(req,res)=>{

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var request = req.body;
  var dbo = db.db("mydb");
  var reviewObj = { id: request.id, review:request.review}

  dbo.collection("reviews").insertOne(reviewObj, function(err, res) {
    if (err) throw err;
    console.log("Number of documents inserted: " + res.insertedCount);

    db.close();
  });
});
res.end();
})

app.get('/fetch',bodyParser.json(),(req,res)=>{

    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("mydb");
        var query = { id: parseInt(req.query.id) };
        dbo.collection("reviews").find(query).toArray(function(err, result) {
          if (err) throw err;
          console.log(result);
          res.send(result)
          db.close();
        });
      });
})

app.listen(port, () => console.log(`Server listening on port ${port}!`))