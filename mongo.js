/**
 * Created by rohitkumar on 22/7/17.
 */

var MongoClient = require('mongodb').MongoClient

// Connection URL
var url = 'mongodb://resume:#rohit9810@ds139801.mlab.com:39801/resumeuser';
var obj ="";
// Use connect method to connect to the server
function connectionDB(run_server){
    MongoClient.connect(url, function(err, db) {
        if(err) throw err;
        console.log("Connected successfully to server");
        obj=db;
        run_server();
    });
}

function insert(data,col,callback){
    obj.collection(col).insertOne(data,function(err,result){
        console.log(data);
        callback(result);
    });
}

function get(data,col,callback){
    obj.collection(col).find(data,{"education":1,"address":1,"experience":1,"personal":1,"skills":1}).toArray(function(err,result){
        callback(result);
    })
}

function getuser(data,col,callback){
    obj.collection(col).find(data).toArray(function(err,result){
        callback(result);
    })
}

function update(data1,data2,col,callback){
    obj.collection(col).updateMany(data1,{$set:data2},function(err,result){
        callback(result);
    })
}

function push(data1,data2,col,callback) {
    obj.collection(col).updateMany(data1,{$push:data2},function(err,result){
        callback(result);
    })
}

function delete_element(data1,data2,callback){
    console.log(data1);
    console.log(data2);
    // {$pull : data3},
    obj.collection('users').updateMany({'email':data1},{$unset : data2},
    function(err,result){
        callback(result);
        // obj.collection('users').updateMany({'email':data1},{$set:{'experience.training.0':}},function(err,result){
        //     callback(result);
        // })
    });
}

module.exports ={
    connectionDB:connectionDB,
    insert:insert,
    get:get,
    update:update,
    push:push,
    getuser:getuser,
    delete_element:delete_element
};


