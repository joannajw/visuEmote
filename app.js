var app = require('http').createServer(handler);
var io = require('socket.io').listen(app);
var static = require('node-static');
var fs = require('fs');
var analyze = require('./analyze');

var fileServer = new static.Server('./');

var port = process.env.PORT || 8080; 
app.listen(port);

function handler(request, response) {

    request.addListener('end', function() {
        fileServer.serve(request, response);
    });
    request.resume();

}

var initialTextFile = "textfiles/hp2_ch1.txt";

// Listen for incoming connections from clients
io.sockets.on('connection', function(socket) {

    fs.readFile(initialTextFile, function(err, info) {
        var text = info.toString(); 
        var textArray = text.split(" ");
        socket.emit('send client initial text', text); 

        analyze.getSentiments_splitBySentence(text, Math.max(10, Math.floor(textArray.length / 300)), function(result) {
            // console.log(result); 
            socket.emit('send client analyzed text', result); 
        })
    });

    console.log("new client"); 

    socket.on('disconnect', function() {
        console.log("disconnect"); 
    });

    socket.on('send server text to analyze', function(data) {
        var text = data.text; 
        var textArray = text.split(" ");
        analyze.getSentiments_splitBySentence(text, Math.max(10, Math.floor(textArray.length / 300)), function(result) {
            socket.emit('send client analyzed text', result); 
        })
    })


});


// =============================================================================

// fs.readFile(textFile, function(err, info) { 
    
//     text = info.toString(); 
//     // console.log(text); 
//     textArray = text.split(" ");

//     analyze.getSentiments(text, Math.floor(textArray.length / 5000), function(result) {

//         fs.writeFile(outFile, JSON.stringify(result).replace(/\"([^(\")"]+)\":/g,"$1:"), function(err) {
//             if (err) { console.log("fs error: ", err); }
//             console.log("file saved"); 
//         })
//         // console.log(result); 
//     })
// }); 