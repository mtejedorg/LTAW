function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length,c.length);
        }
    }
    return "";
}

function deleteCookie(cname){
    document.cookie = cname + "=deleted; expires=Thu, 01 Jan 1970 00:00:00 UTC";
}

function procCookie(cname){
    var cookie = getCookie(cname);
    if (cookie) {               //Means that user wants to delete form cart, so we delete the cookie
        deleteCookie(cname);
    } else {                    //User wants to add to cart, so we create a cookie
        setCookie(cname, "alive", 1000)
    }
}