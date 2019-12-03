apiUrl = 'dankbank.us/api/';
checkAmtCleave = new Cleave('.check-amount', {numeral: true});

download_checks();

function upload_check() {
    let checkImage = document.getElementById('image-file').files[0];
    let acc = $('#check-account-button').attr('value');
    let checkAmt = checkAmtCleave.getRawValue();
    let request = new XMLHttpRequest();
    let formData = new FormData();

    formData.append('image_path', checkImage);
    formData.append('account_id', acc);
    formData.append('authToken', getCookie('authToken'));
    formData.append('check_amount', checkAmt);

    request.open('POST', apiUrl + 'checks');
    request.onload = function () {
        if (this.status === 200) window.location.href = "user-profile.html";
        else M.toast({html: 'Failed to upload check.'});
    };
    request.send(formData);
}

function download_checks() {
    // let request = new XMLHttpRequest();
    // request.responseType = 'blob';
    // request.open('GET', apiUrl + 'checks?authToken=' + getCookie('authToken'));
    // request.onload = function () {
    //     if (this.status === 200) create_check(this.response);
    // };
    // request.send();
}

function create_check(data) {
    // window.location.href = URL.createObjectURL(data);
}

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return 0;
}