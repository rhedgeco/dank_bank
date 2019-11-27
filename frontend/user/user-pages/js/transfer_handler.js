apiUrl = 'http://localhost:6009/api/';
transAmtCleave = new Cleave('.transfer-amount', {numeral: true});

function execute_transfer() {
    let transFrom = $('#transfer-from-button').attr('value');
    let transto = $('#transfer-to-button').attr('value');
    let transAmt = transAmtCleave.getRawValue();
    let request = new XMLHttpRequest();
    let formData = new FormData();

    if(document.getElementById('external-transfer').checked)
        transto = document.getElementById('external-to').value;

    formData.append('from_account_id', transFrom);
    formData.append('to_account_id', transto);
    formData.append('authToken', getCookie('authToken'));
    formData.append('amount', transAmt);

    request.open('POST', apiUrl + 'transfers');
    request.onload = function () {
        if (this.status === 200) window.location.href = "user-profile.html";
        else M.toast({html: 'Failed to execute transfer.'});
    };
    request.send(formData);
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
    return "";
}