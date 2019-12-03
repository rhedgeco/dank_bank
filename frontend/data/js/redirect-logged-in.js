auth = getCookie("authToken");
let request = new XMLHttpRequest();
request.open("GET", "/api/user_profiles?authToken=" + auth);
request.onload = function () {
    if (this.status === 200) {
        let user = JSON.parse(this.response)['username'];
        let navItems = document.getElementById('navbar-items');
        let navSideItems = document.getElementById('nav-side-items');

        let so =
            `<li><a onclick="document.cookie = 'authToken=0;domain=;path=/'; window.location.href = 'index.html'">
                Sign Out
            </a></li>`;
        let li =
            `<li><a href="user/user-profile.html"><i class="material-icons left">account_circle</i>${user}</a></li>`;

        let sow =
            `<li><a class="white-text" onclick="document.cookie = 'authToken=0;domain=;path=/'; window.location.href = 'index.html'">
                Sign Out
            </a></li>`;
        let liw =
            `<li><a class="white-text" href="user/user-profile.html"><i class="material-icons left white-text">account_circle</i>${user}</a></li>`;

        navItems.innerHTML += so + li;
        navSideItems.innerHTML = liw + sow + navSideItems.innerHTML;
    }
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