
auth = getCookie("authToken");
let request = new XMLHttpRequest();
request.open("GET", "/api/user_profiles?authToken=" + auth);
request.onload = function () {
    if (this.status !== 200) window.location.href = "../user/never-here.html";
    else document.cookie = "user_id=" + JSON.parse(this.response)['id'] + ";domain=;path=/";
};
request.send();

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
    return 0;
}