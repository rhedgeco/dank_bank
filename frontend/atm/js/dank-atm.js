apiUrl = "dankbank.us/api/";
accountContent = document.getElementById('account-content');
accountTypes = document.getElementsByName('account-type');
withdrawAccountSelector = document.getElementById('withdraw-account-selector');
withdrawButton = document.getElementById('withdraw-button');
withdrawDisplay = document.getElementById('withdraw-display');

load_accounts();

function onWithdraw() {
    let id = document.getElementById('withdraw-button').getAttribute('value');
    let amount = document.getElementById('withdraw-amount').value;

    let wd = new XMLHttpRequest();
    wd.open("POST", apiUrl + 'withdraw?authToken='+getCookie('authToken')+'&account_id='+id+'&amount='+amount);
    wd.onload = function () {
        if(this.status === 200){
            window.location.href = "dank-atm.html";
        } else {
            M.toast({html : 'Failed to withdraw money.\n'+this.responseText})
        }
    };
    wd.send();
}

function load_accounts() {
    let accountRequest = new XMLHttpRequest();
    accountRequest.open("GET", apiUrl + 'accounts?authToken=' + getCookie('authToken'));
    accountRequest.onload = function () {
        if (this.status === 200) {
            accountContent.innerHTML = "";
            withdrawAccountSelector.innerHTML = "";
            withdrawDisplay.innerHTML = "";
            let accounts = JSON.parse(this.response);
            for (let key in accounts) {
                if (accounts.hasOwnProperty(key)) {
                    add_new_account_block(
                        accounts[key]['account_id'],
                        accounts[key]['type'],
                        accounts[key]['balance']
                    );
                }
            }
        } else {
            window.location.href = "never-here.html";
        }
    };
    accountRequest.send();
}

function add_new_account_block(id, type, amount) {
    amount = formatMoney(amount);
    let desc = "";
    switch (type) {
        case 'CHECKING':
            desc = '' +
                'Account ID: ' + id + '<br>' +
                'Dank Bank Checking Account<br>' +
                'Available Balance: $ ' + amount + '<br>' +
                'Interest Rate : none <br><br>';
            break;
        case 'SAVINGS':
            desc = '' +
                'Account ID: ' + id + '<br>' +
                'Dank Bank Savings Account<br>' +
                'Available Balance: $ ' + amount + '<br>' +
                'Interest Rate : 1.3% annually <br><br>';
            break;

    }

    $.get('html-data/account-block.html', function (data) {
        let block = data.replace('{id-text}', id);
        block = block.replace('{id-text}', id);
        block = block.replace('{acc-id}', id);
        block = block.replace('{type-text}', type);
        block = block.replace('{balance-text}', amount);
        block = block.replace('{description-text}', desc);
        accountContent.innerHTML += block;
    });

    let account = ' ID:' + id + ' - ' + type + ' - $' + amount;
    let accountDrop = `<li value="${id}" class="blue-grey darken-2"><a class="white-text">${account}</a></li>`;
    withdrawAccountSelector.innerHTML += accountDrop;
    $("#withdraw-account-selector li").click(function () {
        withdrawButton.value = $(this).attr('value');
        withdrawDisplay.innerText = $(this).text();
    });
    withdrawButton.value = id;
    withdrawDisplay.innerText = account;
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

// https://stackoverflow.com/questions/149055/how-can-i-format-numbers-as-currency-string-in-javascript
function formatMoney(number, decPlaces, decSep, thouSep) {
    decPlaces = isNaN(decPlaces = Math.abs(decPlaces)) ? 2 : decPlaces,
        decSep = typeof decSep === "undefined" ? "." : decSep;
    thouSep = typeof thouSep === "undefined" ? "," : thouSep;
    var sign = number < 0 ? "-" : "";
    var i = String(parseInt(number = Math.abs(Number(number) || 0).toFixed(decPlaces)));
    var j = (j = i.length) > 3 ? j % 3 : 0;

    return sign +
        (j ? i.substr(0, j) + thouSep : "") +
        i.substr(j).replace(/(\decSep{3})(?=\decSep)/g, "$1" + thouSep) +
        (decPlaces ? decSep + Math.abs(number - i).toFixed(decPlaces).slice(2) : "");
}