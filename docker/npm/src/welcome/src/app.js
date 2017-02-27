var Conf = require('./config/Config.js');

// Loading spinner
m.onLoadingStart = function () {
    document.getElementById('spinner').style.display = 'block';
};
m.onLoadingEnd = function () {
    document.getElementById('spinner').style.display = 'none';
};

// Wrapper for notification which stops animation
m.flashError = function (msg) {
    m.onLoadingEnd();
    $.Notification.notify('error', 'top center', Conf.tr("Error"), msg);
};
m.flashApiError = function (err) {
    if (err && typeof err.message != 'undefined' && err.message == 'Invalid signature') {
        return window.location.href = '/';
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

m.getPromptValue = function (label) {
    return new Promise(function (resolve, reject) {
        jPrompt(label, '', Conf.tr("Message"), Conf.tr("OK"), Conf.tr("Cancel"), function (result) {
            if (result) {
                resolve(result);
            } else {
                reject(new Error(Conf.tr("Empty password")));
            }
        });
    });
};

// Routing
m.route.mode = 'pathname';
m.route(document.getElementById('app'), "/", {
    "/": require('./pages/AgentLogin.js'),
    "/u": require('./pages/UserLogin.js'),
    "/agent": require('./pages/Agent.js'),
    "/user": require('./pages/User.js')
});