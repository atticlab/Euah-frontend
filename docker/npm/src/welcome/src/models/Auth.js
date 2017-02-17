var Conf = require('../config/Config.js');
var Errors = require('../errors/Errors.js');

var Auth = {

    setDefaults: function () {
        this.keypair    = m.prop(false);
        this.type       = m.prop(false);
        this.api        = m.prop(false);
        this.enrollment = m.prop(false);
    },

    userLogin: function (token) {

        Auth.type('user');
        Auth.keypair(StellarSdk.Keypair.random());
        Auth.api(new StellarWallet.Api(Conf.api_url, Auth.keypair()));

        return Auth.api().getUserEnrollment({token: token})
            .then(function (enrollment) {
                if (typeof enrollment.data != 'undefined') {
                    Auth.enrollment(enrollment.data);
                } else {
                    console.error('Unexpected response');
                    console.error(enrollment);
                    return m.flashError(Conf.tr('Service error'));
                }
            })
            .catch(err => {
                console.error(err);
                return m.flashApiError(err);
            })
    },

    agentLogin: function (company_code, token) {

        Auth.type('agent');
        Auth.keypair(StellarSdk.Keypair.random());
        Auth.api(new StellarWallet.Api(Conf.api_url, Auth.keypair()));

        return Auth.api().getAgentEnrollment({company_code: company_code, token: token})
            .then(function (enrollment) {
                if (typeof enrollment.data != 'undefined') {
                    Auth.enrollment(enrollment.data);
                } else {
                    console.error('Unexpected response');
                    console.error(enrollment);
                    return m.flashError(Conf.tr('Service error'));
                }
            })
            .catch(err => {
                console.error(err);
                return m.flashApiError(err);
            })
    },

    logout: function () {
        window.location.href = '/';
    },
};


Auth.setDefaults();

module.exports = Auth;