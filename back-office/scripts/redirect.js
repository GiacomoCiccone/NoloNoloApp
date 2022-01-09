$(document).ready(() => {
    // in caso non ci sia token, fa il redirect
    if (window.localStorage.getItem('token') == null){
        window.location.replace("./login.html");
    }

    // set page title
    var page_name
});

$(document).on('click','#login-exit', function () { // jquery delegation
    window.localStorage.clear();
    window.location.replace("./login.html");
});