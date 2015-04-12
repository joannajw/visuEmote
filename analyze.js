var indico = require('indico.io');
indico.apiKey = "dd9693bd34b00cfeaee1c4fbf46580b6";

var sentiment = require('sentiment');

var analyze = module.exports = {}; 

var indicoIsWorking = false; 

analyze.getSentiments = function(text, chunkSize, cb) {
    // console.log("butts"); 

    words = text.split(" "); // array of words 
    chunks = []; 
    var chunkNum = 0; 
    
    for (var i = 0; i < words.length; i++) {
        if (i % chunkSize == 0) { 
            chunks[chunkNum] = ""; 
            chunkNum++; 
        }
        chunks[ chunkNum - 1 ] += words[i] + " "; 
    }

    result = []; 

    if (indicoIsWorking) {
        indico
            .batchSentiment(chunks)
            .then(function(res){
                console.log(chunks.length); 
                for (var i = 0; i < chunks.length; i++) {
                    result[i] = {};
                    result[i].letter = i; 
                    result[i].text = chunks[i]; 
                    result[i].sentiment = res[i];
                }
                cb(result); 
            })
            .catch(function(err){
                console.log("getSentiments error: ", err); 
            })
    } else { // generate random numbers if indico is down 
        for (var i = 0; i < chunks.length; i++) {
            result[i] = {};
            result[i].letter = i;
            result[i].text = chunks[i];
            result[i].sentiment = Math.random(); 
        }

        cb(result); 
    }
}

analyze.getSentiments_splitBySentence = function(text, chunkSize, cb) {
    
    // split into sentences 
    var sentences = text.match( /[^\.!\?]+[\.!\?]+/g );

    // filter out sentences are are too short 
    var minSentenceLength = 3; 
    sentences = sentences.filter(function(val) {
        return (val.split(" ").length > minSentenceLength);
    });

    // console.log(sentences); 

    result = []; 

    if (indicoIsWorking) {
        indico
            .batchSentiment(sentences)
            .then(function(res){
                for (var i = 0; i < sentences.length; i++) {
                    result[i] = {};
                    result[i].letter = i; 
                    result[i].text = sentences[i]; 
                    result[i].sentiment = res[i];
                }
                cb(result); 
            })
            .catch(function(err){
                console.log("getSentiments error: ", err); 
            })
    } else { // generate random numbers if indico is down 
        for (var i = 0; i < sentences.length; i++) {
            result[i] = {};
            result[i].letter = i;
            result[i].text = sentences[i];
            result[i].sentiment = Math.random(); 
        }

        cb(result); 
    }
}

// this version uses the sentiments module 
// analyze.getSentiments_splitBySentence = function(text, chunkSize, cb) {
//     var sentences = text.match( /[^\.!\?]+[\.!\?]+/g );
//     chunks = sentences; 
//     console.log(chunks); 

//     result = []; 

//     for (var i = 0; i < chunks.length; i++) {
//         result[i] = {};
//         result[i].letter = i;
//         result[i].text = chunks[i];
//         result[i].sentiment = sentiment(chunks[i]).score; 
//     }

//     cb(result); 
// }



