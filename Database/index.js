const { rejects } = require("assert");
const mongoose = require("mongoose");
const ConnectDatabase = ()=>{
    return new Promise((resolve,reject)=>{
        mongoose.connect("mongodb://localhost:27017/5C",(err)=>{
            if(err){
                console.log("Error Connecting Database", err);
                reject();
                return;
            }
            console.log("Connected to Database Successfully!!!");
            resolve()
        });
    })
}

module.exports={
    ConnectDatabase
}