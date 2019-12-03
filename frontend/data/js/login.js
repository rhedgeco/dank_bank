apiUrl = "api.dankbank.us/api/";
usernameField = document.getElementById("username");
passwordField = document.getElementById("password");
error_text = document.getElementById("error_text");

function loginProfile(username, password) {
    let xhttp = new XMLHttpRequest();
    xhttp.open("GET", apiUrl + "auth?username=" + username + "&password=" + password, true);
    xhttp.onload = function () {
        error_text.innerText = "";
        if (this.status === 200) {
            document.cookie = "authToken=" + this.responseText + ";domain=;path=/";
            window.location.href = 'user/user-profile.html';
        } else if (this.status === 400) error_text.innerText = "Invalid username or password";
        else if (this.status !== 0) error_text.innerText = "Err.. something happened :(";
    };
    xhttp.send();
}

// function called by login button
function onLogin() {
    let username = usernameField.value;
    let password = passwordField.value;
    loginProfile(username, password);
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}