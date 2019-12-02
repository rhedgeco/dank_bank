apiUrl = "http://localhost:6009/api/";
usernameField = document.getElementById('username');
pinField = document.getElementById('pin');
error_text = document.getElementById('error_text');

function onLogin() {
    let user = usernameField.value;
    let pin = pinField.value;

    let xhttp = new XMLHttpRequest();
    xhttp.open("GET", apiUrl + "auth?username=" + user + "&pin=" + pin, true);
    xhttp.onload = function () {
        error_text.innerText = "";
        if (this.status === 200) {
            document.cookie = "authToken=" + this.responseText + ";domain=;path=/";
            window.location.href = 'dank-atm.html';
        } else if (this.status === 400) error_text.innerText = "Invalid username or password";
        else if (this.status !== 0) error_text.innerText = "Err.. something happened :(";
    };
    xhttp.send();
}