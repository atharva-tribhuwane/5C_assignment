const mongoose = require("mongoose");
const ConnectDatabase = ()=>{
    return new Promise((resolve,reject)=>{
        mongoose.connect("mongodb+srv://tribhuwanea:sampledb123@cluster0.dsidffs.mongodb.net/5C?retryWrites=true&w=majority",(err)=>{
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