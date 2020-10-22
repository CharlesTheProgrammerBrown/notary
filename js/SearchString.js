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
       //count every word in the fileContent
       for(let word in wordArray){

           let wordValue = wordArray[word];
           if(wordDictionary[wordValue] >0 ){
            wordDictionary[wordValue] += 1;
           }
           
           else{ wordDictionary[wordValue] = 1;
           }
       }

       let wordList = sortProperties(wordDictionary);

       //Return the top 5 words
    var top5Words = wordList.slice(0, 6);
    //return the least 5 words
    var least5Words = wordList.slice(-6, wordList.length);

       //write the values to the page
       ULTemplate(top5Words, document.getElementById("mostUsed"));
       ULTemplate(least5Words, document.getElementById("leastUsed"));

   }
    
function ULTemplate(items, element){
    //grab whole template
    let rowTemplate = document.getElementById('template-ul-items');
    //get the inner html of template
    let templateHTML = rowTemplate.innerHTML;

    //string that holds results from looping the li
    let resultHTML = "";

    for(i=0;i<items.length-1; i++){
        resultHTML= templateHTML.replace('{{val}}' , items[i][0] + ":" + items[i][1] + "time(s)");
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

return rtnArray;

}
}