var Auth = require('../models/Auth.js'),
    Conf = require('../config/Config.js'),
    Helpers = require('../components/Helpers');

module.exports = {

    controller: function () {
        var ctrl = this;

        this.visible = m.prop(false);

        this.toggleVisible = function () {
            this.visible(!this.visible());

            if (this.visible()) {
                $('#mobile-spec-menu').css('max-height', $(window).height() - $('.topbar-main').height());
            }
        };

        this.ttl = m.prop(false);

        this.refreshPage = function () {
            m.route(m.route());
        };

        setInterval(function() {
            if (Auth.api().getNonceTTL() <= 1) {
                Auth.logout();
            }
            ctrl.ttl(Auth.api().getNonceTTL());
            document.getElementById('spinner-time').innerHTML = Helpers.getTimeFromSeconds(ctrl.ttl());

        }, 1000);

        // check that it runs only once
        this.updateTTL = function () {
            m.onLoadingStart();
            Auth.api().initNonce().then(m.onLoadingEnd);
        };

    },

    view: function (ctrl) {
        return <header id="topnav">
            <div class="topbar-main">
                <div class="container">

                    <a href="/" config={m.route} class="logo"><svg class="logo-img"></svg></a>

                    <div class="menu-extras">
                        <ul class="nav navbar-nav navbar-right pull-right hidden-xs">
                            <li>
                                <a href="#" onclick={Auth.logout}>
                                    <span class="fa fa-power-off align-middle m-r-5 f-s-20"></span>
                                    <span class="align-middle">{Conf.tr("Logout")}</span>
                                </a>
                            </li>
                        </ul>
                        <ul class="nav navbar-nav navbar-right pull-right hidden-xs">
                            <li class="dropdown">
                                <a class="dropdown-toggle" data-toggle="dropdown" href="#">
                                    <span class="fa fa-language align-middle m-r-5 f-s-20"></span>
                                    <span class="align-middle">{Conf.current_language}</span>
                                    &nbsp;
                                    <span class="fa fa-caret-down align-middle f-s-20"></span>
                                </a>
                                <ul class="dropdown-menu dropdown-user">
                                    <li>
                                        <a onclick={Conf.loc.changeLocale.bind(ctrl, 'en')} href="#"><img
                                            src="/assets/img/flags/en.png"/> English</a>
                                        <a onclick={Conf.loc.changeLocale.bind(ctrl, 'ua')} href="#"><img
                                            src="/assets/img/flags/ua.png"/> Українська</a>
                                        <a onclick={Conf.loc.changeLocale.bind(ctrl, 'ru')} href="#"><img
                                            src="/assets/img/flags/ru.png"/> Русский</a>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                        <ul class="nav navbar-nav navbar-right pull-right hidden-xs">
                            <li>
                                <a
                                    href="#"
                                    onclick={ctrl.updateTTL.bind(ctrl)}
                                    title={Conf.tr('Time before the session close. Click to update session.')}
                                >
                                    <span class="fa fa-clock-o m-r-5 align-middle f-s-20"></span>
                                    <span class="align-middle" id="spinner-time">
                                            {
                                                !ctrl.ttl() ?
                                                    ''
                                                    :
                                                    Helpers.getTimeFromSeconds(ctrl.ttl())
                                            }
                                            </span>
                                </a>
                            </li>
                        </ul>
                        <ul class="nav navbar-nav navbar-right pull-right hidden-xs">
                            <li>
                                <a
                                    href="#"
                                    onclick={ctrl.refreshPage.bind(ctrl)}
                                    title={Conf.tr('Click for update page.')}
                                >
                                    <span class="fa fa-refresh align-middle f-s-20"></span>
                                </a>
                            </li>
                        </ul>
                        <div class="menu-item">
                            <a onclick={ctrl.toggleVisible.bind(ctrl)}
                               class={ctrl.visible() ? 'open navbar-toggle' : 'navbar-toggle'}>
                                <div class="lines">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                            </a>
                        </div>
                    </div>

                </div>
            </div>


            <div class="navbar-custom">
                <div class="container">
                    <div id="navigation" style={ctrl.visible()? 'display:block;' : ''}>
                        <ul class="navigation-menu" id="mobile-spec-menu">
                            <li>
                                <a href="/" config={m.route}><i class="md md-dashboard"></i>{Conf.tr("Dashboard")}</a>
                            </li>
                            <li>
                                <a href="/payments" config={m.route}><i class="md md-list"></i>{Conf.tr("Payments")}</a>
                            </li>
                            <li>
                                <a href="/transfer" config={m.route}><i
                                    class="fa fa-money"></i>{Conf.tr("Transfer money")}</a>
                            </li>

                            <li>
                                <a href="/invoice" config={m.route}><i
                                    class="md md-payment"></i>{Conf.tr("Create invoice")}</a>
                            </li>
                            {(Auth.username()) ?
                                <li>
                                    <a href="/settings" config={m.route}><i class="md md-settings"></i>{Conf.tr("Settings")}
                                    </a>
                                </li>
                            : ''}
                            <li class="visible-xs">
                                <a href="#" onclick={Auth.logout}><i class="fa fa-power-off m-r-5"></i>
                                    {Conf.tr("Logout")}
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </header>
    }
};