function newGame()
{
   guessCnt=0;
   guess="";
   server();
   displayHash();
   displayGuessStr();
   displayGuessCnt();
}

function server()
{
   xmlhttp = new XMLHttpRequest();
   xmlhttp.open("GET","http://localhost:8001/getstring", true);
   xmlhttp.onreadystatechange=function(){
   window.alert("xmlhttp.status");
         if (xmlhttp.readyState==4 && xmlhttp.status==200){
           window.alert("hola");
           string=xmlhttp.responseText;
           window.alert("message" + string);
         }
   }
   xmlhttp.send();
}