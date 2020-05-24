//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser= require("body-parser");
const request = require("request");


const app=express();

app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended:true}));

const mailchimpName=process.env.NAME;
const mailchimpAPI=process.env.API;

const mailchimpLogin=String(mailchimpName+" "+mailchimpAPI);


app.get("/",function (req,res){
    res.sendFile(__dirname+"/signup.html");
     
});

app.post("/",function (req,res){
    var firstName= req.body.fname;
    var lastName= req.body.lname;
    var email= req.body.email;
    var data ={
        members:[{
            email_address:email,
            status:"subscribed",
            merge_fields:{
                FNAME:firstName,
                LNAME:lastName
            }
        }]
    };

    var jsonData=JSON.stringify(data);


    
    var option = {
        url :String(process.env.URL),
        method:"POST",
        headers: {
            "Authorization": mailchimpLogin
        },
        body:jsonData
    };

    request(option,function(error,response,body){
        if (error){
            res.sendFile(__dirname+"/failed.html");
         } else{
                if(response.statusCode===200){
                    res.sendFile(__dirname+"/success.html");
                }
                else{
                    res.sendFile(__dirname+"/failed.html");
                }
            }
        }); 
});

app.listen(process.env.PORT || 3000,function(){

});

