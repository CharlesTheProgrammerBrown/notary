//Load a book from disk to server to my webpage

function loadBooks(fileName, displayName)
{
    let currentBook="";
    let url ="books/" + fileName;
    

    //reset diplay when different book is clicked
    document.getElementById("fileName").innerHTML= displayName;
    document.getElementById("searchstat").innerHTML = "";
    document.getElementById("keyword").value="";

    //books on server so send HTTPRequest to obtian
    var xhr = new XMLHttpRequest();

    //configure request
    //method, url to request, [asynchronous/synchronous, authentication]
    //method:GET/POST, url, [ true / false, user, password]
    xhr.open("GET",url,true);

    //initiate network traffic
    //grabs file to send
    xhr.send();

    //its asynchronous so need to know when its done
    xhr.onreadystatechange = ()=>{
      //ready state
     //  0- doc is unsent 
    //  1- doc/file now open 
   //  2- received header,got info about request
  //  3- loading the file back
 //   4 - done, load from file complete

      //request status - 200 is okay,404 not found, 403 Forbidden
             if(xhr.readyState == 4 && xhr.status == 200){
                 currentBook = xhr.responseText;

                  //line breaks & carriage returns removed
                  currentBook = currentBook.replace(/(?:\r\n|\r|\n)/g, '<br>');

                 //contents of file set to html
                 document.getElementById("fileContent").innerHTML = currentBook;

                 //return scroll top of book
                 var elmnt = document.getElementById("fileContent");
                 elmnt.scrollTop = 0;
                
             }
    }
}