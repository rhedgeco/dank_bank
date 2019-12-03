apiUrl = "dankbank.us/api/";
accountContent = document.getElementById('account-content');
accountTypes = document.getElementsByName('account-type');
checkAccountSelector = document.getElementById('check-account-selector');
transferFromSelector = document.getElementById('transfer-from-selector');
transfertoSelector = document.getElementById('transfer-to-selector');
transSection = document.getElementById('trans-section');

load_accounts();
load_transactions(0);

function load_accounts() {
    let accountRequest = new XMLHttpRequest();
    accountRequest.open("GET", apiUrl + 'accounts?authToken=' + getCookie('authToken'));
    accountRequest.onload = function () {
        if (this.status === 200) {
            accountContent.innerHTML = "";
            checkAccountSelector.innerHTML = "";
            transferFromSelector.innerHTML = "";
            transfertoSelector.innerHTML = "";
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

function create_account() {
    let accType = 'CHECKING';
    for (let i = 0, length = accountTypes.length; i < length; i++) {
        if (accountTypes[i].checked) {
            accType = accountTypes[i].value;
        }
    }
    let request = new XMLHttpRequest();
    request.open('POST', apiUrl + 'accounts?authToken=' + getCookie('authToken') + '&type=' + accType);
    request.onload = function () {
        if (this.status === 200) load_accounts();
        else M.toast({html: 'Failed to create account.'});
    };
    request.send()
}

function add_new_account_block(id, type, amount) {
    let checkAccountButton = document.getElementById('check-account-button');
    let checkAccountDisplay = document.getElementById('check-account-display');
    let transferFromButton = document.getElementById('transfer-from-button');
    let transferFromDisplay = document.getElementById('transfer-from-display');
    let transfertoButton = document.getElementById('transfer-to-button');
    let transfertoDisplay = document.getElementById('transfer-to-display');

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

    $.get('user-pages/html-data/account-block.html', function (data) {
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
    checkAccountSelector.innerHTML += accountDrop;
    transferFromSelector.innerHTML += accountDrop;
    transfertoSelector.innerHTML += accountDrop;
    $("#check-account-selector li").click(function () {
        checkAccountButton.value = $(this).attr('value');
        checkAccountDisplay.innerText = $(this).text();
    });
    $("#transfer-from-selector li").click(function () {
        transferFromButton.value = $(this).attr('value');
        transferFromDisplay.innerText = $(this).text();
    });
    $("#transfer-to-selector li").click(function () {
        transfertoButton.value = $(this).attr('value');
        transfertoDisplay.innerText = $(this).text();
    });
    checkAccountButton.value = id;
    transferFromButton.value = id;
    transfertoButton.value = id;
    checkAccountDisplay.innerText = account;
    transferFromDisplay.innerText = account;
    transfertoDisplay.innerText = account;
}

function load_transactions(transAcc) {
    let transId = document.getElementById('trans-id-sec');
    if(transAcc!=0) transId.innerText = ` ID: ${transAcc}`;
    else transId.innerText = "";
    transSection.innerHTML = '<div class="progress"><div class="indeterminate"></div></div>';
    let request = new XMLHttpRequest();
    request.open('GET', apiUrl + 'transfers?authToken=' + getCookie('authToken') + '&account_id=' + transAcc);
    request.onload = function () {
        if (this.status === 200) {
            transSection.innerHTML = '';
            let trans = JSON.parse(this.response);
            for (let key in trans) {
                if (trans.hasOwnProperty(key)) {
                    add_transaction(trans[key], transAcc)
                }
            }
        } else M.toast({html: 'Failed to get transactions.'});
    };
    request.send()
}

function focus_transactions(transAcc) {
    location.href = '#trans-focus';
    load_transactions(transAcc);
}

function add_transaction(trans, curr_id) {
    let curr_user = getCookie('user_id');
    let trans_id = trans['trans_id'];
    let from_user = trans['send_user_id'];
    let to_user = trans['receive_id'];
    let from_acc_id = trans['send_account_id'];
    let to_acc_id = trans['receive_account_id'];
    let amount = trans['amount'];
    let desc = trans['description'];

    let sendText = "";
    if (from_acc_id == 0) {
        sendText = `Check deposit to Account ID:${to_acc_id}`;
        amount = `<span class="light-green-text">+ ${amount}</span>`;
    } else if (from_user == curr_user && to_user == curr_user) {
        sendText = `Transferred funds from ID:${from_acc_id} to ID:${to_acc_id}.`;
        amount = `<span>${amount}</span>`;
    } else if (from_user == curr_user) {
        sendText = `ID:${from_acc_id} sent funds.`;
        amount = `<span class="amber-text">- ${amount}</span>`;
    } else if (to_user == curr_user) {
        sendText = `ID:${to_acc_id} received funds.`;
        amount = `<span class="light-green-text">+ ${amount}</span>`;
    }

    $.get('user-pages/html-data/transfer-block.html', function (data) {
        let block = data.replace('{send-text}', sendText);
        block = block.replace('{amount-text}', amount);
        transSection.innerHTML += block;
    });
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