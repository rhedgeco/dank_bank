apiUrl = "dankbank.us/api/";
navTabs = document.getElementById('nav-tabs');
profileName = document.getElementById('profile-name');
profileUsername = document.getElementById('profile-username');
profileEmail = document.getElementById('profile-email');
profilePhone = document.getElementById('profile-phone');
profileAddress = document.getElementById('profile-address');

function update_user() {
    let request = new XMLHttpRequest();
    let token = getCookie('authToken');
    request.open('GET', apiUrl + 'user_profiles?authToken=' + token);
    request.onload = function () {
        if (this.status === 200) {
            let user = JSON.parse(this.response);
            profileName.innerText = user['last_name']+', '+user['first_name'];
            profileUsername.innerText = user['username'];
            profileEmail.innerText = user['email'];
            profilePhone.innerText = user['phone_number'];
            profileAddress.innerText = user['address'];
        }
    };
    request.send();
}

window.onload = function () {
    update_user();
};

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