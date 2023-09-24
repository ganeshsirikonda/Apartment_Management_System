require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose=require("mongoose")

const app = express();
const PORT=process.env.PORT || 3000;

mongoose.set('strictQuery',false);
const connectDB=async()=>{
    try{
        const conn=await mongoose.connect(process.env.MONGO_URI);
        console.log("mongo db connected");
    }catch(error){
        console.log(error);
        process.exit(1);
    }
}

connectDB().then(()=>{
    app.listen(PORT,()=>{
        console.log(`listening on port ${PORT}`);
    })
    
});

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


// mongoose.connect("mongodb://localhost:27017/apartment")
const optionsSchema={
    option:String
}

const Option=mongoose.model("Option",optionsSchema);

const option1=new Option({
    option:"View"
})

const option2=new Option({
    option:"Add"
})

const option3=new Option({
    option:"Update"
})

const option4=new Option({
    option:"Delete"
})

// Option.insertMany([option1,option2,option3,option4])

const personsSchema={
    name:String,
    flat_no:Number,
    due:Number
}

const Person=mongoose.model("Person",personsSchema)

const person1=new Person({
    name:"a",
    flat_no:1,
    due:1000
})

// person1.save()

const passwordSchema={
    password:String
}

const Password=mongoose.model("Password",passwordSchema)

const password=new Password({
    password:"1234"
})

// password.save();

app.get("/",function(req,res){
    res.render("home");
})

app.post("/",function(req,res){

    const personPassword=req.body.password;

    if (personPassword==="1234"){
        Option.find({}).then(function(foundOptions){
            res.render("options",{optionsList:foundOptions})
        })
    }
    else{
        res.render("error");
    }
    

})

app.post("/options",function(req,res){

    res.render("options");
})

app.post("/option",function(req,res){
    
    const optionName=req.body.btn;
    if (optionName==="View"){
        Person.find({}).then(function(foundPersons){
            res.render("view",{personsList:foundPersons})
        })
    }

    if (optionName==="Add"){
        res.render("add");
    }

    if (optionName==="Update"){
        res.render("update");
    }

    if (optionName==="Delete"){
        res.render("delete");
    }

})

app.post("/update",function(req,res){

    const personName=req.body.name;
    const personDue=req.body.due;

    Person.updateOne({name:personName}, {$set:{due:personDue}}, {new:true}).exec();

    Person.find({}).then(function(foundPersons){
        res.render("view",{personsList:foundPersons})
    })

})

app.post("/add",function(req,res){

    const personName=req.body.name;
    const personFalt_no=req.body.flat_no;
    const personDue=req.body.due;

    const person=new Person({
        name:personName,
        flat_no:personFalt_no,
        due:personDue
    })

    Person.insertMany([person]);

    Person.find({}).then(function(foundPersons){
        res.render("view",{personsList:foundPersons})
    });

})

app.post("/delete",function(req,res){

    const personName=req.body.name;

    Person.deleteOne({name:personName}).exec();

    Person.find({}).then(function(foundPersons){
        res.render("view",{personsList:foundPersons})
    });

})

app.post("/retry",function(req,res){
    res.render("home");
})

// app.listen(3000,function(req,res){
//     console.log("server started at port 3000")
// })