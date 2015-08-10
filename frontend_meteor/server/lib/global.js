/*Exports
confJSON
fs
exec
filesDirectory
localWSServer
localIdentConn
masterWSServer
masterIdentConn
*/

Meteor.startup(function () {
  fs = Npm.require('fs')
  exec = Npm.require('child_process').exec
  cheerio = Meteor.npmRequire('cheerio')
  var WebSocket = Meteor.npmRequire('ws')
  var flareConf = process.env.FLARECONF
  confJSON = Npm.require(flareConf)

  filesDirectory = confJSON.flare.directory+'/files/'

  String.prototype.escapeSpecialChars = function() {
    return this.replace(/\\n/g, "\\\\n")
    .replace(/\\'/g, "\\\'")
    .replace(/\\"/g, '\\\"')
    .replace(/\\&/g, "\\\&")
    .replace(/\\r/g, "\\\r")
    .replace(/\\t/g, "\\\\t")
    .replace(/\\b/g, "\\\b")
    .replace(/\\f/g, "\\\f");
  };

  UploadServer.init({
    tmpDir: filesDirectory+'jar/tmp',
    uploadDir: filesDirectory+'jar/',
    checkCreateDirectories: true
  })


  SparkDB = new Mongo.Collection("spark")
  SparkDB.remove({})
  Meteor.publish('spark', function() {
    //TODO: decide whether to implement this for efficiency reasons (and maybe security reasons)
    //return SparkDB.find({}, {fields: {Status: 1, Workers: 1, URL: 1, Applications: 1, connections: 1}})
    return SparkDB.find()
  })

  IPFSDB = new Mongo.Collection("ipfs")
  IPFSDB.remove({})
  Meteor.publish('ipfs', function() {
    return IPFSDB.find()
  })

  CassandraDB = new Mongo.Collection("cassandra")
  CassandraDB.remove({})
  Meteor.publish('cassandra', function() {
    return CassandraDB.find()
  })


  JARSDB = new Mongo.Collection("jars")
  JARSDB.remove({})
  Meteor.publish('jars', function() {
    return JARSDB.find()
  })

  ConfigDB = new Mongo.Collection("config")
  ConfigDB.remove({})
  ConfigDB.insert({
  "cassandra": {
    "directory": "",
    "ip": "",
    "password": "",
    "port": "",
    "username": ""
  },
  "flare": {
    "address": "",
    "directory": "",
    "local": {
      "ip": "",
      "port": ""
    },
    "master": {
      "ip": "",
      "port": ""
    },
    "price": ""
  },
  "spark": {
    "cores": "",
    "directory": "",
    "log4j": {
      "conversionPattern": "",
      "appender": "",
      "directory": "",
      "layout": "",
      "maxFileSize": "",
      "rootCategory": ""
    },
    "master": {
      "ip": "",
      "port": ""
    },
    "price": "",
    "receiverMemory": ""
  }
})
  Meteor.publish('config', function() {
    return ConfigDB.find()
  })

  //35275 is 'flark' (flare spark) on keypads
  localWS = new WebSocket('ws://'+confJSON.flare.local.ip+':'+confJSON.flare.local.port+'/local')

  localWS.on('error', Meteor.bindEnvironment(function(error) {
    console.log('Local WebSocket Connect Error: ' + error.toString());
  }))

  localWS.on('message', Meteor.bindEnvironment( function(message) {
    console.log('Flare Received Message: ' + message.escapeSpecialChars());

    var data = JSON.parse(message.escapeSpecialChars())

    //flag for when goserver responds with the requested log data
    if (data.flag == "getLog" && data.success == true){
      switch (data.type) {
        case "sparkUI":
        SparkDB.upsert({},{sparkUILog: data.text})
        break;
        case "spark":
        SparkDB.upsert({},{sparkLog: data.text})
        break;
        case "tracing":
        CassandraDB.upsert({},{tracingLog: data.text})
        break;
        case "session":
        CassandraDB.upsert({},{systemLog: data.text})
        break;
        default:
      }
    }
    if (data.flag == "getConfig" && data.success == true) {
      ConfigDB.upsert({}, JSON.parse(data.text))
    }
  }))
})
