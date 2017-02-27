var Conf = require('./config/Config.js');
var Auth = require('./models/Auth.js');
var queue = require('queue');
var q = queue();

// Loading spinner
m.onLoadingStart = function () {
    q.push(true);
    document.getElementById('spinner').style.display = 'block';
};
m.onLoadingEnd = function () {
    q.pop();
    if (!q.length) {
        document.getElementById('spinner').style.display = 'none';
    }
};

// Wrapper for notification which stops animation
m.flashError = function (msg) {
    m.onLoadingEnd();
    $.Notification.notify('error', 'top center', "Error", msg);
};
m.flashApiError = function (err) {
    if (err && typeof err.message != 'undefined' && err.message == 'Invalid signature') {
        return Auth.destroySession();
    }
    m.onLoadingEnd();
    if (!err.message) {
        console.error('Unexpected ApiError response');
        console.error(err);

        return $.Notification.notify('error', 'top center', Conf.tr("Error"), Conf.tr('Service error'));
    }
    switch (err.message) {
        case 'ERR_NOT_FOUND':
            return $.Notification.notify('error', 'top center', Conf.tr("Error"), Conf.tr("Record not found") + ': ' + Conf.tr(err.description));
        default:
            return $.Notification.notify('error', 'top center', Conf.tr("Error"), Conf.tr('Service error'));
    }
};
m.flashSuccess = function (msg) {
    m.onLoadingEnd();
    $.Notification.notify('success', 'top center', "Success", msg);
};

m.getPromptValue = function (label, errMsg = false) {
    if (!errMsg) errMsg = Conf.tr('Empty value');
    return new Promise(function (resolve, reject) {
        jPrompt(label, '', Conf.tr('Message'), Conf.tr('OK'), Conf.tr('Cancel'), function (result) {
            if (result) {
                resolve(result);
            } else {
                reject(new Error(errMsg));
            }
        });
    });
};

// Routing
m.route.mode = 'pathname';
m.route(document.getElementById('app'), "/", {
    "/": require('./pages/Login.js'),
    "/transfer": require('./pages/Transfer/Transfer'),
    "/payments": require('./pages/Payments/Payments'),
    "/settings": require('./pages/Settings/Settings'),
    "/recovery": require('./pages/Recovery'),
    "/cards": require('./pages/Cards/CardsList'),
    "/cards/generate": require('./pages/Cards/CardsGenerate'),
});