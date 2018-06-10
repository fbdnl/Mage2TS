// Getting the main class
var Mage2TS = require('./lib/tools.js').Mage2TS;

// Defining utility vars
var validParams = {
    host: new RegExp("--(host)=([a-zA-Z0-9\.://]+)"),
    store: new RegExp("--(store)=([a-zA-Z0-9\.://]+)"),
    class: new RegExp("--(class)=([a-zA-Z0-9\.://]+)"),
    firebase: new RegExp("--(firebase)=(true|false)")
};
var _param, _key;

// Parsing input and inflating Mage2TS object
process.argv.forEach(function(val, index) {
    if (index < 2)
        return;

    _key = val.match(new RegExp("--(.*)="))[1];

    if (_param = val.match(validParams[_key]))
        Mage2TS.data[_param[1]] = _param[2];
    else
        console.log("Parameter '" + _key + "' or its value was not recognized. Ignored.");
});

// Effectively launching get & parse
Mage2TS.init();