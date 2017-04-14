var Conf = require('../config/Config.js');
var Auth = require('../models/Auth.js');
var test = require('../models/Test');

module.exports = {

    controller: function () {
        var ctrl = this;

        // if (!Auth.keypair()) {
        //     return m.route('/');
        // }

        // Conf.SmartApi.Api.refreshNonce();

        this.random = {
            admin: getRandomName(),
            amount: Math.floor(Math.random() * (99 - 1)) + 1,
            phone: Math.floor(Math.random() * (9999999999 - 1000000000)) + 1000000000
        };

        console.log("-------- Random Values --------");
        console.log(this.random);

        this.getWallet = function (e) {
            e.preventDefault();
            m.onLoadingStart();

            return test.getWallet('9999999999', 'Attic123')
                .then(handleSuccess)
                .catch(handleError)
        };

        this.requiredTests = function (e) {
            e.preventDefault();


        };
    },

    view: function (ctrl) {
        return [
        <header id="top-nav">
            <div class="topbar-main">
                <div class="container">
                    <a href="/" config={m.route} class="logo" style="position:absolute"><svg class="auth-logo-img"></svg></a>
                    <h3 class="text-center">Тесты системы</h3>
                </div>
            </div>
        </header>,

        <div class="container">
            <div class="row">
                <div class="col-md-8 col-md-offset-2">
                    <div class="portlet">
                        <a data-toggle="collapse" data-parent="#accordion1" href="#test1">
                            <div class="portlet-heading bg-primary">
                                <h3 class="portlet-title">
                                    Предварительный тест
                                </h3>
                                <div class="clearfix"></div>
                            </div>
                        </a>
                        <div id="test1" class="panel-collapse collapse in">
                            <div class="portlet-body">
                                <p class="m-b-20">
                                    Это обязательный предварительный тест для создания основополагающих элементов системы, без которых она не будет функционировать
                                </p>

                                <div class="list-group m-b-0">

                                    <li class="list-group-item">
                                        <h4 class="list-group-item-heading">Создание администратора</h4>

                                        <p class="list-group-item-text text-warning"></p>

                                        <div class="text-center">
                                            <a href={Conf.riak_check + 'wallets' + '/keys/' + ctrl.random.phone} target="_blank"  class="btn btn-warning waves-light waves-effect m-r-10">Проверить</a>
                                            <button class="btn btn-primary waves-light waves-effect" onclick={test.getWallet.bind(ctrl, '9999999999', 'Attic123')}>
                                                Запустить
                                            </button>
                                        </div>
                                    </li>

                                    <li class="list-group-item">
                                        <h4 class="list-group-item-heading">Создание эмитента</h4>

                                        <p class="list-group-item-text text-warning"></p>

                                        <div class="text-center">
                                            <a href={Conf.riak_check + 'wallets' + '/keys/' + ctrl.random.phone} target="_blank"  class="btn btn-warning waves-light waves-effect m-r-10">Проверить</a>
                                            <button class="btn btn-primary waves-light waves-effect" onclick={ctrl.getWallet.bind(ctrl)}>
                                                Запустить
                                            </button>
                                        </div>
                                    </li>

                                    <li class="list-group-item">
                                        <h4 class="list-group-item-heading">Создание валюты</h4>

                                        <p class="list-group-item-text text-warning"></p>

                                        <div class="text-center">
                                            <a href={Conf.riak_check + 'wallets' + '/keys/' + ctrl.random.phone} target="_blank"  class="btn btn-warning waves-light waves-effect m-r-10">Проверить</a>
                                            <button class="btn btn-primary waves-light waves-effect" onclick={ctrl.getWallet.bind(ctrl)}>
                                                Запустить
                                            </button>
                                        </div>
                                    </li>

                                    <li class="list-group-item">
                                        <h4 class="list-group-item-heading">Создание агента по распостранению</h4>

                                        <p class="list-group-item-text text-warning"></p>

                                        <div class="text-center">
                                            <a href={Conf.riak_check + 'wallets' + '/keys/' + ctrl.random.phone} target="_blank"  class="btn btn-warning waves-light waves-effect m-r-10">Проверить</a>
                                            <button class="btn btn-primary waves-light waves-effect" onclick={ctrl.getWallet.bind(ctrl)}>
                                                Запустить
                                            </button>
                                        </div>
                                    </li>

                                    <li class="list-group-item">
                                        <h4 class="list-group-item-heading">Проведение эмиссии</h4>

                                        <p class="list-group-item-text text-warning"></p>

                                        <div class="text-center">
                                            <a href={Conf.riak_check + 'wallets' + '/keys/' + ctrl.random.phone} target="_blank"  class="btn btn-warning waves-light waves-effect m-r-10">Проверить</a>
                                            <button class="btn btn-primary waves-light waves-effect" onclick={ctrl.getWallet.bind(ctrl)}>
                                                Запустить
                                            </button>
                                        </div>
                                    </li>


                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="row">
                <div class="col-md-8 col-md-offset-2">
                    <div class="portlet">
                        <a data-toggle="collapse" data-parent="#accordion1" href="#test2">
                            <div class="portlet-heading bg-inverse">
                                <h3 class="portlet-title">
                                    Создание эмитента
                                </h3>
                                <div class="clearfix"></div>
                            </div>
                        </a>
                        <div id="test2" class="panel-collapse collapse">
                            <div class="portlet-body">
                                <p class="m-b-20">
                                    Эмитент
                                </p>

                                <div class="list-group m-b-0">
                                    <li class="list-group-item">
                                        <h4 class="list-group-item-heading">Проведение эмиссии</h4>

                                        <p class="list-group-item-text text-warning"></p>

                                        <div class="text-center">
                                            <a href={Conf.riak_check + 'wallets' + '/keys/' + ctrl.random.phone} target="_blank"  class="btn btn-warning waves-light waves-effect m-r-10">Проверить</a>
                                            <button class="btn btn-primary waves-light waves-effect" onclick={ctrl.getWallet.bind(ctrl)}>
                                                Запустить
                                            </button>
                                        </div>
                                    </li>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="row">
                <div class="col-md-8 col-md-offset-2">
                    <div class="portlet">
                        <a data-toggle="collapse" data-parent="#accordion1" href="#test3">
                            <div class="portlet-heading bg-inverse">
                                <h3 class="portlet-title">
                                    Создание валюты
                                </h3>
                                <div class="clearfix"></div>
                            </div>
                        </a>
                        <div id="test3" class="panel-collapse collapse">
                            <div class="portlet-body">
                                <p class="m-b-20">
                                    Валюта
                                </p>

                                <div class="list-group m-b-0">
                                    <li class="list-group-item">
                                        <h4 class="list-group-item-heading">Проведение эмиссии</h4>

                                        <p class="list-group-item-text text-warning"></p>

                                        <div class="text-center">
                                            <a href={Conf.riak_check + 'wallets' + '/keys/' + ctrl.random.phone} target="_blank"  class="btn btn-warning waves-light waves-effect m-r-10">Проверить</a>
                                            <button class="btn btn-primary waves-light waves-effect" onclick={ctrl.getWallet.bind(ctrl)}>
                                                Запустить
                                            </button>
                                        </div>
                                    </li>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="row">
                <div class="col-md-8 col-md-offset-2">
                    <div class="portlet">
                        <a data-toggle="collapse" data-parent="#accordion1" href="#test4">
                            <div class="portlet-heading bg-inverse">
                                <h3 class="portlet-title">
                                    Предварительный тест
                                </h3>
                                <div class="clearfix"></div>
                            </div>
                        </a>
                        <div id="test4" class="panel-collapse collapse">
                            <div class="portlet-body">
                                <p class="m-b-20">
                                    Это обязательный предварительный тест для создания основополагающих элементов системы, без которых она не будет функционировать
                                </p>

                                <div class="list-group m-b-0">
                                    <li class="list-group-item">
                                        <h4 class="list-group-item-heading">Проведение эмиссии</h4>

                                        <p class="list-group-item-text text-warning"></p>

                                        <div class="text-center">
                                            <a href={Conf.riak_check + 'wallets' + '/keys/' + ctrl.random.phone} target="_blank"  class="btn btn-warning waves-light waves-effect m-r-10">Проверить</a>
                                            <button class="btn btn-primary waves-light waves-effect" onclick={ctrl.getWallet.bind(ctrl)}>
                                                Запустить
                                            </button>
                                        </div>
                                    </li>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>



        </div>
        ];
    }

};

function handleSuccess() {
    m.onLoadingEnd();
    return m.flashSuccess("Операция прошла успешно!");
}

function handleError(err) {
    m.onLoadingEnd();
    console.warn(err);
    return m.flashError(Conf.tr(err));
}

function getRandomName() {
    var text = "";
    var possible = "abcdefghijklmnopqrstuvwxyz";

    for( var i=0; i < 6; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}