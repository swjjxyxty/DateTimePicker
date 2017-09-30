var log_utils = function () {
    var utils = {}, debug = false;
    utils.log = function (msg) {
        if (debug)
            console.log(msg)
    };
    utils.enable = function () {
        debug = true;
    };
    utils.disable = function () {
        debug = false;
    };
    return utils;
};