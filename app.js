var restify = require('restify');
var builder = require('botbuilder');
var firebase = require("firebase");
var functions = require('firebase-functions');
var admin = require('firebase-admin');



// Setup Restify Server
var server = restify.createServer();

var serviceAccount = require("./charbot-firebase-firebase-adminsdk-tmb4f-e124b4f07f.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://charbot-firebase.firebaseio.com"
});

var config = {
    apiKey: "AIzaSyChN6Z32Hkgee8zf0vdnax3t86qp0k80cU",
    authDomain: "charbot-firebase.firebaseapp.com",
    databaseURL: "https://charbot-firebase.firebaseio.com",
    projectId: "charbot-firebase",
    storageBucket: "",
    messagingSenderId: "5259106020"
};

firebase.initializeApp(config);



var database = firebase.database();

server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});

// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

// Listen for messages from users 
server.post('/api/messages', connector.listen());

var bot = new builder.UniversalBot(connector, function (session) {
    writeMessage(session.message.text);
    let sent = false;

    ref.limitToLast(1).on("child_changed", function(snapshot) {
        if (sent) {
            return;
        }
        var changedPost = snapshot.val();
        var mykey = snapshot.key;

        console.log("changed post: "+changedPost.text);//undefined
        session.send(changedPost.text);
        sent=true;



    });

});


var ref = firebase.database().ref("/messages");


function writeMessage(message) {
    var usersRef = firebase.database().ref('messages/');

    usersRef.push(message, function(error) {
        if (error) {
            console.log("Data could not be saved." + error);
        } else {
            console.log("Data saved successfully.");
        }
    });

}