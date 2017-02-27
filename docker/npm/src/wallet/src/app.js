var Conf = require('./config/Config.js');
var Auth = require('./models/Auth.js');

// Loading spinner
m.onLoadingStart = function () {
    document.getElementById('spinner').style.display = 'block';
}
m.onLoadingEnd = function () {
    document.getElementById('spinner').style.display = 'none';
}

// Wrapper for notification which stops animation
m.flashError = function (msg) {
    m.onLoadingEnd();
    $.Notification.notify('error', 'top center', Conf.tr("Error"), msg);
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
    $.Notification.notify('success', 'top center', Conf.tr("Success"), msg);
};

// Routing
m.route.mode = 'pathname';
m.route(document.getElementById('app'), "/", {
    "/": require('./pages/Login.js'),
    "/home": require('./pages/Home.js'),
    "/logout": require('./pages/Logout.js'),
    "/invoice": require('./pages/Invoice.js'),
    "/sign": require('./pages/Sign.js'),
    "/transfer": require('./pages/Transfer.js'),
    "/settings": require('./pages/Settings.js'),
    //"/hd": require('./pages/Hd.js'),
    "/transaction/:trans_id/:target_acc/:amount/:asset": require('./pages/Transaction.js'),
    "/payments": require('./pages/Payments.js'),
    "/recovery": require('./pages/Recovery.js')
});