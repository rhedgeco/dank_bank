apiUrl = "dankbank.us/api/";

pass = document.getElementById("password");
passConf = document.getElementById("passConf");
passConfTip = document.getElementById("passConfTip");
passLock = document.getElementById("passLock");
passConfLock = document.getElementById("passConfLock");

pin = document.getElementById("pin");
pinTip = document.getElementById("pinTip");
pinConf = document.getElementById("pinConf");
pinConfTip = document.getElementById("pinConfTip");
pinLock = document.getElementById("pinLock");
pinConfLock = document.getElementById("pinConfLock");

first_name = document.getElementById("first_name");
last_name = document.getElementById("last_name");
username = document.getElementById("username");
email = document.getElementById("email");
phone = document.getElementById("phone");
address = document.getElementById("address");

error_text = document.getElementById("error_text");

var cleavePhone = new Cleave(
    '.phone-input', {
        numericOnly: true,
        delimiters: ['+', ' (', ') ', '-'],
        blocks: [0, 1, 3, 3, 4]
    }
);

pass.onblur = function () {
    if (pass.classList.contains('invalid'))
        passLock.innerText = 'lock_open';
    else
        passLock.innerText = 'lock';

    check_passwords_match();
};

pin.onblur = function () {
    validate_pin();
    if (pin.classList.contains('invalid'))
        pinLock.innerText = 'lock_open';
    else
        pinLock.innerText = 'lock';

    check_pin_match();
};

passConf.onkeyup = function () {
    check_passwords_match();
};

passConf.onblur = function () {
    check_passwords_match();
};

pinConf.onkeyup = function () {
    check_pin_match()
};

pinConf.onblur = function () {
    validate_pin_conf();
    check_pin_match()
};

function check_passwords_match(attr) {
    if (pass.value !== passConf.value) {
        passConfTip.setAttribute('data-error', 'passwords need to match');
        passConf.classList.remove("valid");
        passConf.classList.add("invalid");
        passConfLock.innerText = 'lock_open';
        return;
    }

    if (passConf.value === '') {
        passConfTip.setAttribute('data-error', 'field cannot be blank');
        passConf.classList.remove("valid");
        passConf.classList.add("invalid");
        passConfLock.innerText = 'lock_open';
        return;
    }

    passConf.classList.remove("invalid");
    passConf.classList.add("valid");
    passConfLock.innerText = 'lock';
}

function validate_pin() {
    if (pin.value.length !== 4) {
        pinTip.setAttribute('data-error', 'pin must be 4 digits');
        pin.classList.remove("valid");
        pin.classList.add("invalid");
        pinLock.innerText = 'lock_open';
    }
}

function validate_pin_conf() {
    if (pin.value.length !== 4) {
        pinConfTip.setAttribute('data-error', 'pin must be 4 digits');
        pinConf.classList.remove("valid");
        pinConf.classList.add("invalid");
        pinConfLock.innerText = 'lock_open';
    }
}

function check_pin_match() {
    if (pin.value !== pinConf.value) {
        pinConfTip.setAttribute('data-error', 'pin needs to match');
        pinConf.classList.remove("valid");
        pinConf.classList.add("invalid");
        pinConfLock.innerText = 'lock_open';
        return;
    }

    if (pinConf.value.length <= 3) {
        pinConfTip.setAttribute('data-error', 'field must be 4 numbers');
        pinConf.classList.remove("valid");
        pinConf.classList.add("invalid");
        pinConfLock.innerText = 'lock_open';
        return;
    }

    pinConf.classList.remove("invalid");
    pinConf.classList.add("valid");
    pinConfLock.innerText = 'lock';
}

function call_post_user(first_name, last_name, username, password, pin, email, phone, address) {
    let request = new XMLHttpRequest();
    request.open("POST", apiUrl + 'user_profiles?' +
        'first_name=' + first_name +
        '&last_name=' + last_name +
        '&username=' + username +
        '&password=' + password +
        '&pin=' + pin +
        '&email=' + email +
        '&phone_number=' + phone +
        '&address=' + address
    );
    request.onload = function () {
        if (this.status === 200) window.location.href = "../index.html";
        else if (this.status === 403) error_text.innerText = "Username already exists.";
        else if (this.status === 400) error_text.innerText = "Cannot submit blank required entries.";
        else if (this.status === 0) error_text.innerText = "Trouble accessing server... Try again later.";
    };
    request.send();
}

function create_user() {
    if (
        first_name.classList.contains('invalid') ||
        last_name.classList.contains('invalid') ||
        username.classList.contains('invalid') ||
        pass.classList.contains('invalid') ||
        passConf.classList.contains('invalid') ||
        pin.classList.contains('invalid') ||
        pinConf.classList.contains('invalid') ||
        email.classList.contains('invalid') ||
        phone.classList.contains('invalid') ||
        address.classList.contains('invalid')
    ) {
        error_text.innerText = "Cannot submit invalid entries.";
        return
    }

    error_text.innerText = " ";
    call_post_user(first_name.value, last_name.value, username.value, pass.value, pin.value, email.value,
        cleavePhone.getRawValue(), address.value);
}
