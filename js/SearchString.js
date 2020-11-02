//load a book from disk

function loadBook(filename, displayName){
    let currentBook = "";
    let url ="books/" + filename;

    //reset our ui at every click of link
    document.getElementById("fileName").innerHTML = displayName;
    document.getElementById("searchstat").innerHTML="";
    document.getElementById("keyword").innerHTML ="";

    //create a server  request to load our book
    //loaded from server -> string back to browser

    //XMLHttp request
    var xht = new XMLHttpRequest();

    //configure request
    //method, url to request, [asynchronous/synchronous, authentication]
    //method:GET/POST, url, [ true / false, user, password]
    xht.open("GET", url, true);


     //initiate network traffic
    //with network command send 
    xht.send();

    //its asynchronous so need to know when its done
    //use anonymous func and event fired by XMLHttp request
    //used when anything changes about the request

    xht.onreadystatechange = function (){
        if (xht.readyState == 4 && xht.status ==200){
            currentBook = xht.responseText;

            getDocStats(currentBook);
            //format text files (content) they return carriage lines feed
            //so replace with html equivalent
            currentBook = currentBook.replace(/(?:\r\n|\r|\n)/g,'<br>');

            document.getElementById("fileContent").innerHTML = currentBook;

            var elmt = document.getElementById("fileContent");
            elmt.scrollTop = 0; //scroll to top of book or string
        }
    }

   function getDocStats(fileContent){
       var docLength = document.getElementById("docLength");
       var wordCount = document.getElementById("wordCount");
       var charCount = document.getElementById("charCount");

       let text = fileContent.toLowerCase();
       let wordArray = text.match(/\b\S+\b/g);
       let wordDictionary = {}

       var uncommonWords = [];

       //filter out the uncommon words
       uncommonWords = filterStopWords(wordArray);
   
   
       //Count every word in the wordArray
       for (let word in uncommonWords) {
           let wordValue = uncommonWords[word];
           if (wordDictionary[wordValue] > 0) {
               wordDictionary[wordValue] += 1;
           } else {
               wordDictionary[wordValue] = 1;
           }
       }

       let wordList = sortProperties(wordDictionary);

       //Return the top 5 words
    var top5Words = wordList.slice(0, 6);
    //return the least 5 words
    console.log(top5Words);
    var least5Words = wordList.slice(-6, wordList.length);

       //write the values to the page
       ULTemplate(top5Words, document.getElementById("mostUsed"));
       ULTemplate(least5Words, document.getElementById("leastUsed"));

       docLength.innerText = "Document Length: " + text.length;
       wordCount.innerText = "Word Count: " + wordArray.length;
   }
    
function ULTemplate(items, element){
    //grab whole template
    let rowTemplate = document.getElementById('template-ul-items');
    //get the inner html of template
    let templateHTML = rowTemplate.innerHTML;

    //string that holds results from looping the li
    let resultHTML = "";

    for(i=0;i<items.length-1; i++){
        resultHTML += templateHTML.replace('{{val}}',items[i][0] + " : " + items[i][1] + "time(s)");
    }

    element.innerHTML = resultHTML;

}

   //sort from frequent to least
function sortProperties(obj){
//first convert object to an array
let rtnArray = Object.entries(obj);

//Sort the array
rtnArray.sort(function(first, second){
    return second[1] - first[1];
});

console.log(rtnArray);
return rtnArray;

}

//filter out stop words
function filterStopWords(wordArray){
    var commonWords = getStopWords();
    var commonObj = {};
    var uncommonArr = [];

    for(i=0;i<commonWords.length;i++){
        commonObj[commonWords[i].trim()]=true;
    }
    
    for(i=0;i<wordArray.length; i++){
        word = wordArray[i].trim().toLowerCase();

        if(!commonObj[word]){
            uncommonArr.push(word);
        }
    }
    return uncommonArr;
}

function getStopWords() {
    return ["a", "able", "about", "across", "after", "all", "almost", "also", "am", "among", "an", "and", "any", "are", "as", "at", "be", "because", "been", "but", "by", "can", "cannot", "could", "dear", "did", "do", "does", "either", "else", "ever", "every", "for", "from", "get", "got", "had", "has", "have", "he", "her", "hers", "him", "his", "how", "however", "i", "if", "in", "into", "is", "it", "its", "just", "least", "let", "like", "likely", "may", "me", "might", "most", "must", "my", "neither", "no", "nor", "not", "of", "off", "often", "on", "only", "or", "other", "our", "own", "rather", "said", "say", "says", "she", "should", "since", "so", "some", "than", "that", "the", "their", "them", "then", "there", "these", "they", "this", "tis", "to", "too", "twas", "us", "wants", "was", "we", "were", "what", "when", "where", "which", "while", "who", "whom", "why", "will", "with", "would", "yet", "you", "your", "ain't", "aren't", "can't", "could've", "couldn't", "didn't", "doesn't", "don't", "hasn't", "he'd", "he'll", "he's", "how'd", "how'll", "how's", "i'd", "i'll", "i'm", "i've", "isn't", "it's", "might've", "mightn't", "must've", "mustn't", "shan't", "she'd", "she'll", "she's", "should've", "shouldn't", "that'll", "that's", "there's", "they'd", "they'll", "they're", "they've", "wasn't", "we'd", "we'll", "we're", "weren't", "what'd", "what's", "when'd", "when'll", "when's", "where'd", "where'll", "where's", "who'd", "who'll", "who's", "why'd", "why'll", "why's", "won't", "would've", "wouldn't", "you'd", "you'll", "you're", "you've"];
}

//MARK THE WORDS IN SEARCH
}

function performMark(){

    //read keyword
    var keyword = document.getElementById("keyword").value;
    var display = document.getElementById("fileContent");

    var newContent ="";

    //find all currently marked items
    let spans = document.querySelectorAll('mark');

    for (var i=0; i<spans.length;i++){
        //<mark>Harry</mark>
        //Harry
        spans[i].outerHTML = spans[i].innerHTML;
    }

    //global and case insenstive
    var re = new RegExp(keyword, "gi");
    //replace-inline when called takes current content and replaces with $&
    var replaceText = "<mark id='markme'>$&</mark>";
    var bookContent = display.innerHTML;

    //add the mark to the book content
    newContent = bookContent.replace(re, replaceText);

    display.innerHTML = newContent;
    var count = document.querySelectorAll('mark').length;
    document.getElementById("searchstat").innerHTML = "found" + count + "matches";

    if(count >0){
        var element = document.getElementById("markme");
        //scrolls to first item
        element.scrollIntoView();
    };

}
