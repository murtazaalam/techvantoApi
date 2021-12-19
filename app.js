var express = require('express');
var app = express();
var mongoose = require('mongoose');
var dotenv = require('dotenv');
dotenv.config();
var bodyParser = require('body-parser')
var cors = require('cors')
var db;

var mongo = require('mongodb');
var MongoClient = mongo.MongoClient;
var mongoUrl = process.env.MongoLiveUrl;

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cors());

var port = process.env.PORT || 2000;

app.get('/', (req, res) => {
    res.send("default routing");
})

app.get('/allcourses', (req, res) => {
    db.collection('courses').find().toArray((err, result) => {
        if(err) throw err;
        res.send(result);
    })
})

app.get('/allcourses/:id', (req, res) => {
    var id = mongoose.Types.ObjectId(req.params.id);
    db.collection('courses').find({_id: id}).toArray((err, result) =>{
        if(err) throw err;
        res.send(result);
    })
})

app.get('/instructor/:course_id', (req, res) => {
    var courseId = req.params.course_id;
    var query = {'courses.course_id':courseId}
    db.collection('instructor').find(query).toArray((err, result) => {
        if(err) throw err;
        res.send(result[0]);
    })
})

app.get('/category', (req, res) => {
    db.collection('category').find().toArray((err, result) => {
        if(err) throw err;
        res.send(result)
    })
})

app.get('/category/:id', (req, res) => {
    var catId = mongoose.Types.ObjectId(req.params.id);
    db.collection('category').find({_id:catId}).toArray((err, result) => {
        if(err) throw err;
        res.send(result);
    })
})

//post new course api
app.post('/newcourse', (req, res) => {
    //console.log(req.body);
    db.collection('courses').insert(req.body, (err, result) => {
        if(err) throw err;
        res.send("New Course Added Successfully.");
    })
})

//delete api
app.delete('/delete-course/:id', (req, res) => {
    var id = mongoose.Types.ObjectId(req.params.id);
    db.collection('courses').remove({_id: id}, (err, result)=>{
        if(err) throw err;
        res.send("Course Deleted Successfully");
    })

})
//update api
app.put('/edit/:id', (req, res) => {
    var id = mongoose.Types.ObjectId(req.params.id);
    db.collection('courses').updateOne({_id: id}, {
        $set:{ 
            "category_id": req.body.category_id,
            "sub_category_name": req.body.sub_category_name,
            "price": req.body.price,
            "duration": req.body.duration,
            "image": req.body.image,
            "rating": req.body.rating,
            "trainer_name": req.body.trainer_name,
            "level": req.body.level
        }
    })
    res.send("Course Updated Successfully.")
})

//update status
app.put('/edit/status/:id', (req, res) => {
    var id = mongoose.Types.ObjectId(req.params.id);
    
    db.collection('courses').updateOne({_id: id}, {
        $set:{
            "status": req.body.status
        }
    })
    res.send("Status update");
})

//mongodb connection
MongoClient.connect(mongoUrl, (err, client) => {
    if(err) console.log("Error while connecting to MongoDB.");
    db = client.db('edutech');
    app.listen(port, () =>{
        console.log("listening to port: " + port);
    })
})
