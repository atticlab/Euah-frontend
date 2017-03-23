var AuthNavbar = require('../components/AuthNavbar.js');
var Auth = require('../models/Auth.js');
var Conf = require('../config/Config.js');
const ProgressBar = require('../components/ProgressBar');

var Login = module.exports = {
    controller: function () {
        var ctrl = this;
        // this.wordNum = m.prop(1);

        if (Auth.keypair()) {
            return m.route('/home');
        }

        // listener for sdk events
        Auth.setListener(function (progress) {
            ctrl.progress(progress);
        });

        this.onunload = function() {
            Auth.removeListener();
        };

        // masker for phone input
        this.getPhoneWithViewPattern = function (number) {
            if (number.substr(0, Conf.phone.prefix.length) != Conf.phone.prefix) {
                number = Conf.phone.prefix;
            }
            return m.prop(VMasker.toPattern(number, {pattern: Conf.phone.view_mask, placeholder: "x"}));
        };

        this.addPhoneViewPattern = function (e) {
            ctrl.username = ctrl.getPhoneWithViewPattern(e.target.value);
        };

        this.username = ctrl.getPhoneWithViewPattern(Conf.phone.prefix);
        this.progress = m.prop(0);
        this.showProgress = m.prop(false);

        this.login = function(e) {
            e.preventDefault();

            // get phone in db format from input
            let login = VMasker.toPattern(e.target.login.value, Conf.phone.db_mask).substr(2);

            if (login.length > 0 && login.match(/\d/g).length != Conf.phone.length) {
                return m.flashError(Conf.tr("Invalid phone"));
            }

            ctrl.showProgress(true);
            m.onLoadingStart();

            Auth.login(login, e.target.password.value)
                .then(function () {
                    ctrl.showProgress(false);
                    m.route('/home');
                })
                .catch(err => {
                    m.startComputation();
                    ctrl.showProgress(false);
                    ctrl.progress(0);
                    m.endComputation();

                    if (err.name === "ConnectionError") {
                        console.error(err);
                        return m.flashError(Conf.tr("Service error. Please contact support"));
                    } else {
                        console.log(err);
                        return m.flashError(Conf.tr("Login/password combination is invalid"));
                    }
                })
                .then(() => {
                    m.onLoadingEnd();
                })
        };
    },

    view: function (ctrl) {
        return <div>
            {m.component(AuthNavbar)}

            <div class="wrapper-page">
                {ctrl.showProgress() ?
                    <div class="form-group m-t-10">
                        {m(ProgressBar, {
                            value: ctrl.progress,
                            text : Conf.tr("Decrypting your account for signing in")
                        })}
                    </div>
                    :
                    <div class="auth-form">
                        <div class="text-center">
                            <h3>{Conf.tr("Log in to OpenbankIT")}</h3>
                        </div>
                        <form class="form-horizontal m-t-30" onsubmit={ctrl.login.bind(ctrl)}>
                            <div class="form-group">
                                <div class="col-xs-12">
                                    <input class="form-control" id="loginInput" type="tel" name="login" required="required"
                                           placeholder={Conf.tr("Enter your mobile phone number: ") + Conf.phone.view_mask}
                                           title={Conf.tr("Ukrainian phone number format allowed: +38 (050) 123-45-67")}
                                           oninput={ctrl.addPhoneViewPattern.bind(ctrl)} autofocus
                                           value={ctrl.username()}
                                    />
                                    <i class="md md-account-circle form-control-feedback l-h-34"></i>
                                </div>
                            </div>
                            <div class="form-group">
                                <div class="col-xs-12">
                                    <input class="form-control" type="password" autocapitalize="none"
                                           placeholder={Conf.tr("Password")} name="password"/>
                                    <i class="md md-vpn-key form-control-feedback l-h-34"></i>
                                </div>
                            </div>

                            <div class="form-group m-t-20 text-center">
                                <button
                                    class="form-control btn btn-primary btn-lg btn-custom waves-effect w-md waves-light m-b-5"
                                    type="submit">{Conf.tr("Log in")}
                                </button>
                            </div>
                        </form>

                        <div class="m-t-10">
                            <a href="/sign" config={m.route} class="">{Conf.tr("Create an account")}</a>
                            <a href="/recovery" config={m.route} class="pull-right">{Conf.tr("Forgot your password?")}</a>
                        </div>
                    </div>
                }
            </div>
        </div>
    }
};
