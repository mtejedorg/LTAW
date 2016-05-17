function toReadyStateDescription(state) {
    switch (state) {
        case 0:
            return 'UNSENT';
        case 1:
            return 'OPENED';
        case 2:
            return 'HEADERS_RECEIVED';
        case 3:
            return 'LOADING';
        case 4:
            return 'DONE';
        default:
            return '';
    }
}

var addedSuggestions = {};

function serve(value) {
    var xmlHttp;
    if (window.XMLHttpRequest){
        xmlHttp = new XMLHttpRequest();     //Most of navigators
    } else {
        xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");      //IE
    }
    xmlHttp.onreadystatechange=function() {
        console.log('ReadyState changed to: ' + toReadyStateDescription(xmlHttp.readyState));
        if(xmlHttp.readyState == 4) {       //Completed
            if (xmlHttp.status==200) {      // OK
                var suggestions = xmlHttp.responseText;
                suggestions = JSON.parse(suggestions);

                for (var i in suggestions){
                    var suggestion = suggestions[i];
                    var option = document.createElement("option");
                    if (!addedSuggestions[suggestion]){
                        option.value = suggestion;
                        document.getElementById("suggestions").appendChild(option);
                        addedSuggestions[suggestion] = suggestion;
                    }
                }
            }
        }
    }

    xmlHttp.open("POST","http://localhost:8000/",true);
    xmlHttp.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xmlHttp.setRequestHeader('Content-type', 'application/json');
    xmlHttp.send(value);
}

function proc(){
    var input = document.getElementById("suggestionsinput");
    var value = input.value;
    if (value.length > 2){
        value = JSON.stringify({"message": value})
        serve(value);
    }
}