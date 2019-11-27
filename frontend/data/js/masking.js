window.onload = function () {
    var pinsCollection = document.getElementsByClassName("pin-input");
    var pins = Array.from(pinsCollection);

    pins.forEach(function (pin) {
        new Cleave(pin, {
            blocks: [1,1,1,1],
            delimiter: '',
            numericOnly: true
        })
    });
};