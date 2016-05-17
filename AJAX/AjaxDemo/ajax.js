function ajaxFunction() {
    var xmlHttp;
    if (window.XMLHttpRequest)
        xmlHttp = new XMLHttpRequest();     //Most of navigators
    else
        xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");      //IE

        xmlHttp.onreadystatechange=function() {
        if(xmlHttp.readyState == 4) {       //Completed
            //if (request.status==200) {      // OK
            document.myForm.time.value += xmlHttp.responseText + "\n";
            //}
        }
    }
    xmlHttp.open("GET","time.php",true);
    xmlHttp.send(null);
}