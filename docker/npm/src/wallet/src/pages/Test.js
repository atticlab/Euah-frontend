var Conf = require('../config/Config.js');
var test = require('../models/Test');

module.exports = {

    controller: function () {
        var ctrl = this;

        Conf.SmartApi.setKeypair(test.keypairs.anonym);
        Conf.SmartApi.Api.getNonce();

        this.keypairs = {
            admin: {
                created: false
            },
            emission: {
                created: false
            },
            distr: {
                created: false
            },
            merchant: {
                created: false
            },
            anonym: {
                created: false
            },
            registered: {
                created: false
            },
            card: {
                created: false
            },
            exchange: {
                created: false
            },
            invoice: {
                code: null
            }
        };

        this.updateBalances = function () {
            return Conf.horizon.accounts().accountId(test.keypairs.distr.accountId()).call()
                .then((account_data) => {
                    var balances = '';
                    account_data.balances.map(function (balance) {
                        if (typeof balance.asset_code != 'undefined') {
                            balances += parseFloat(balance.balance).toFixed(2) + ' ' + balance.asset_code + ' ';
                        }
                    });
                    m.startComputation();
                    ctrl.keypairs.distr.balances = balances;
                    m.endComputation();

                    return Conf.horizon.accounts().accountId(test.keypairs.anonym.accountId()).call()
                })
                .catch(function (err) {
                    console.log('it\'s normal, can be not created yet');
                    console.log(err);
                })
                .then((account_data) => {
                    var balances = '';
                    account_data.balances.map(function (balance) {
                        if (typeof balance.asset_code != 'undefined') {
                            balances += parseFloat(balance.balance).toFixed(2) + ' ' + balance.asset_code + ' ';
                        }
                    });
                    m.startComputation();
                    ctrl.keypairs.anonym.balances = balances;
                    m.endComputation();

                    return Conf.horizon.accounts().accountId(test.keypairs.merchant.accountId()).call()
                })
                .catch(function (err) {
                    console.log('it\'s normal, can be not created yet');
                    console.log(err);
                })
                .then((account_data) => {
                    var balances = '';
                    account_data.balances.map(function (balance) {
                        if (typeof balance.asset_code != 'undefined') {
                            balances += parseFloat(balance.balance).toFixed(2) + ' ' + balance.asset_code + ' ';
                        }
                    });
                    m.startComputation();
                    ctrl.keypairs.merchant.balances = balances;
                    m.endComputation();

                    return Conf.horizon.accounts().accountId(test.keypairs.registered.accountId()).call()
                })
                .catch(function (err) {
                    console.log('it\'s normal, can be not created yet');
                    console.log(err);
                })
                .then((account_data) => {
                    var balances = '';
                    account_data.balances.map(function (balance) {
                        if (typeof balance.asset_code != 'undefined') {
                            balances += parseFloat(balance.balance).toFixed(2) + ' ' + balance.asset_code + ' ';
                        }
                    });
                    m.startComputation();
                    ctrl.keypairs.registered.balances = balances;
                    m.endComputation();

                    return Conf.horizon.accounts().accountId(test.keypairs.card.accountId()).call()
                })
                .catch(function (err) {
                    console.log('it\'s normal, can be not created yet');
                    console.log(err);
                })
                .then((account_data) => {
                    var balances = '';
                    account_data.balances.map(function (balance) {
                        if (typeof balance.asset_code != 'undefined') {
                            balances += parseFloat(balance.balance).toFixed(2) + ' ' + balance.asset_code + ' ';
                        }
                    });
                    m.startComputation();
                    ctrl.keypairs.card.balances = balances;
                    m.endComputation();
                })
                .catch(function (err) {
                    console.log('it\'s normal, can be not created yet');
                    console.log(err);
                });
        };

        this.handleOperation = function (callback, params, e) {
            e.preventDefault();
            m.onLoadingStart();

            return test[callback].apply(this, params || [])
                .then(function (response) {
                    switch (callback) {
                        case 'createAdmin':
                            m.startComputation();
                            ctrl.keypairs.admin.created = true;
                            m.endComputation();
                            break;
                        case 'deleteAdmin':
                            m.startComputation();
                            ctrl.keypairs.admin.created = false;
                            m.endComputation();
                            break;
                        case 'createEmission':
                            m.startComputation();
                            ctrl.keypairs.emission.created = true;
                            m.endComputation();
                            break;
                        case 'deleteEmission':
                            m.startComputation();
                            ctrl.keypairs.emission.created = false;
                            m.endComputation();
                            break;
                        case 'createRegisteredUser':
                            m.startComputation();
                            ctrl.keypairs.registered.created = true;
                            m.endComputation();
                            break;
                        case 'createAnonym':
                            m.startComputation();
                            ctrl.keypairs.anonym.created = true;
                            m.endComputation();
                            break;
                        case 'sendMoney':
                            ctrl.updateBalances();
                            break;
                        case 'makeEmission':
                            ctrl.updateBalances();
                            break;
                        case 'useCard':
                            ctrl.updateBalances();
                            break;
                        case 'createCard':
                            return ctrl.updateBalances()
                                .then(function () {
                                    m.startComputation();
                                    ctrl.keypairs.card.created = true;
                                    m.endComputation();
                                })
                                .catch(function (err) {
                                    console.log(err);
                                });
                            break;
                        case 'createAgent':
                            switch (params[0]) {
                                case test.keypairs.distr.accountId():
                                    m.startComputation();
                                    ctrl.keypairs.distr.created = true;
                                    m.endComputation();
                                    break;
                                case test.keypairs.merchant.accountId():
                                    m.startComputation();
                                    ctrl.keypairs.merchant.created = true;
                                    m.endComputation();
                                    break;
                            }
                            break;
                        case 'createInvoice':
                            m.startComputation();
                            ctrl.keypairs.invoice.code = response.data.id;
                            m.endComputation();
                    }
                })
                .then(handleSuccess)
                .catch(handleError)
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
                        <a data-toggle="collapse" data-parent="#accordion1" href="#accounts">
                            <div class="portlet-heading bg-primary">
                                <h3 class="portlet-title">
                                    Тестовые аккаунты
                                </h3>
                                <div class="clearfix"></div>
                            </div>
                        </a>
                        <div id="accounts" class="panel-collapse collapse in">
                            <div class="portlet-body">
                                <p class="m-b-20">
                                     В процессе проведения теста будут создаваться аккаунты всех типов. Здесь будут отображены их балансы, мнемоники и т.д.
                                </p>
                                <div class="list-group m-b-0">
                                    <table class="table table-striped m-0">
                                        <thead>
                                        <tr>
                                            <th>Тип</th>
                                            <th>Ключ</th>
                                            <th>Статус</th>
                                            <th>Баланс</th>
                                            <th>Мнемоника</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        <tr>
                                            <td>Администратор</td>
                                            <td>{test.keypairs.admin.accountId()}</td>
                                            <td>{ctrl.keypairs.admin.created ? 'Создан' : 'Не создан'}</td>
                                            <td>-</td>
                                            <td>{StellarSdk.getMnemonicFromSeed(test.keypairs.admin.seed())}</td>
                                        </tr>
                                        <tr>
                                            <td>Ключ эмиссии</td>
                                            <td>{test.keypairs.emission.accountId()}</td>
                                            <td>{ctrl.keypairs.emission.created ? 'Создан' : 'Не создан'}</td>
                                            <td>-</td>
                                            <td>{StellarSdk.getMnemonicFromSeed(test.keypairs.emission.seed())}</td>
                                        </tr>
                                        <tr>
                                            <td>Агент по распространению</td>
                                            <td>{test.keypairs.distr.accountId()}</td>
                                            <td>{ctrl.keypairs.distr.created ? 'Создан' : 'Не создан'}</td>
                                            <td>
                                                {
                                                    ctrl.keypairs.distr.balances ?
                                                        ctrl.keypairs.distr.balances
                                                        :
                                                        '-'
                                                }
                                            </td>
                                            <td>{StellarSdk.getMnemonicFromSeed(test.keypairs.distr.seed())}</td>
                                        </tr>
                                        <tr>
                                            <td>Мерчант</td>
                                            <td>{test.keypairs.merchant.accountId()}</td>
                                            <td>{ctrl.keypairs.merchant.created ? 'Создан' : 'Не создан'}</td>
                                            <td>
                                                {
                                                    ctrl.keypairs.merchant.balances ?
                                                        ctrl.keypairs.merchant.balances
                                                        :
                                                        '-'
                                                }
                                            </td>
                                            <td>{StellarSdk.getMnemonicFromSeed(test.keypairs.merchant.seed())}</td>
                                        </tr>
                                        <tr>
                                            <td>Анонимный пользователь</td>
                                            <td>{test.keypairs.anonym.accountId()}</td>
                                            <td>{ctrl.keypairs.anonym.created ? 'Создан' : 'Не создан'}</td>
                                            <td>
                                                {
                                                    ctrl.keypairs.anonym.balances ?
                                                        ctrl.keypairs.anonym.balances
                                                        :
                                                        '-'
                                                }
                                            </td>
                                            <td>{StellarSdk.getMnemonicFromSeed(test.keypairs.anonym.seed())}</td>
                                        </tr>
                                        <tr>
                                            <td>Зарегистрированный пользователь</td>
                                            <td>{test.keypairs.registered.accountId()}</td>
                                            <td>{ctrl.keypairs.registered.created ? 'Создан' : 'Не создан'}</td>
                                            <td>
                                                {
                                                    ctrl.keypairs.registered.balances ?
                                                        ctrl.keypairs.registered.balances
                                                        :
                                                        '-'
                                                }
                                            </td>
                                            <td>{StellarSdk.getMnemonicFromSeed(test.keypairs.registered.seed())}</td>
                                        </tr>
                                        <tr>
                                            <td>Предоплаченная карта</td>
                                            <td>{test.keypairs.card.accountId()}</td>
                                            <td>{ctrl.keypairs.card.created ? 'Создан' : 'Не создан'}</td>
                                            <td>
                                                {
                                                    ctrl.keypairs.card.balances ?
                                                        ctrl.keypairs.card.balances
                                                        :
                                                        '-'
                                                }
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

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
                                        <div class="text-center">
                                            <a href={Conf.horizon_host + '/accounts/' + Conf.master_key} target="_blank"  class="btn btn-warning waves-light waves-effect m-r-10">Проверить</a>
                                            {
                                                ctrl.keypairs.admin.created ?
                                                    <button class="btn btn-danger waves-light waves-effect" onclick={ctrl.handleOperation.bind(ctrl, 'deleteAdmin', [])}>
                                                        Удалить
                                                    </button>
                                                    :
                                                    <button class="btn btn-primary waves-light waves-effect" onclick={ctrl.handleOperation.bind(ctrl, 'createAdmin', [])}>
                                                        Создать
                                                    </button>
                                            }
                                        </div>
                                    </li>
                                    <li class="list-group-item">
                                        <h4 class="list-group-item-heading">Создание эмитента</h4>
                                        <div class="text-center">
                                            <a href={Conf.horizon_host + '/accounts/' + Conf.master_key} target="_blank"  class="btn btn-warning waves-light waves-effect m-r-10">Проверить</a>
                                            {
                                                ctrl.keypairs.emission.created ?
                                                    <button class="btn btn-danger waves-light waves-effect" onclick={ctrl.handleOperation.bind(ctrl, 'deleteEmission', [])}>
                                                        Удалить
                                                    </button>
                                                    :
                                                    <button class="btn btn-primary waves-light waves-effect" onclick={ctrl.handleOperation.bind(ctrl, 'createEmission', [])}>
                                                        Создать
                                                    </button>
                                            }
                                        </div>
                                    </li>
                                    <li class="list-group-item">
                                        <h4 class="list-group-item-heading">Создание валюты</h4>
                                        <div class="text-center">
                                            <a href={Conf.horizon_host + '/assets'} target="_blank"  class="btn btn-warning waves-light waves-effect m-r-10">Проверить</a>
                                            <button class="btn btn-primary waves-light waves-effect" onclick={ctrl.handleOperation.bind(ctrl, 'createAsset', [])}>
                                                Запустить
                                            </button>
                                        </div>
                                    </li>
                                    <li class="list-group-item">
                                        <h4 class="list-group-item-heading">Создание агента по распостранению</h4>
                                        <div class="text-center">
                                            <a href={Conf.horizon_host + '/accounts/' + test.keypairs.distr.accountId()} target="_blank"  class="btn btn-warning waves-light waves-effect m-r-10">Проверить</a>
                                            <button class="btn btn-primary waves-light waves-effect" onclick={ctrl.handleOperation.bind(ctrl, 'createAgent', [test.keypairs.distr.accountId(), StellarSdk.xdr.AccountType.accountDistributionAgent().value])}>
                                                Запустить
                                            </button>
                                        </div>
                                    </li>
                                    <li class="list-group-item">
                                        <h4 class="list-group-item-heading">Проведение эмиссии [1000 {Conf.asset}]</h4>
                                        <div class="text-center">
                                            <a href={Conf.horizon_host + '/accounts/' + test.keypairs.distr.accountId()} target="_blank"  class="btn btn-warning waves-light waves-effect m-r-10">Проверить</a>
                                            <button class="btn btn-primary waves-light waves-effect" onclick={ctrl.handleOperation.bind(ctrl, 'makeEmission', [1000])}>
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
                        <a data-toggle="collapse" data-parent="#accordion1" href="#createAnonym">
                            <div class="portlet-heading bg-inverse">
                                <h3 class="portlet-title">
                                    Создание анонимного пользователя
                                </h3>
                                <div class="clearfix"></div>
                            </div>
                        </a>
                        <div id="createAnonym" class="panel-collapse collapse">
                            <div class="portlet-body">
                                <div class="list-group m-b-0">
                                    <li class="list-group-item">
                                        <div class="text-center">
                                            <a href={Conf.horizon_host + '/accounts/' + test.keypairs.anonym.accountId()} target="_blank"  class="btn btn-warning waves-light waves-effect m-r-10">Проверить</a>
                                            <button class="btn btn-primary waves-light waves-effect" onclick={ctrl.handleOperation.bind(ctrl, 'createAnonym', [])}>
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
                        <a data-toggle="collapse" data-parent="#accordion1" href="#sendMoneyDTOA">
                            <div class="portlet-heading bg-inverse">
                                <h3 class="portlet-title">
                                    Перевод средств с агента по распространению на анонимного пользователя (50 {Conf.asset})
                                </h3>
                                <div class="clearfix"></div>
                            </div>
                        </a>
                        <div id="sendMoneyDTOA" class="panel-collapse collapse">
                            <div class="portlet-body">
                                <div class="list-group m-b-0">
                                    <li class="list-group-item">
                                        <div class="text-center">
                                            <a href={Conf.horizon_host + '/accounts/' + test.keypairs.anonym.accountId()} target="_blank"  class="btn btn-warning waves-light waves-effect m-r-10">Проверить</a>
                                            <button class="btn btn-primary waves-light waves-effect" onclick={ctrl.handleOperation.bind(ctrl, 'sendMoney', [test.keypairs.distr, test.keypairs.anonym.accountId(), 50])}>
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
                        <a data-toggle="collapse" data-parent="#accordion1" href="#createRegisteredUser">
                            <div class="portlet-heading bg-inverse">
                                <h3 class="portlet-title">
                                    Создание зарегистрированного пользователя
                                </h3>
                                <div class="clearfix"></div>
                            </div>
                        </a>
                        <div id="createRegisteredUser" class="panel-collapse collapse">
                            <div class="portlet-body">
                                <div class="list-group m-b-0">
                                    <li class="list-group-item">
                                        <div class="text-center">
                                            <a href={Conf.horizon_host + '/accounts/' + test.keypairs.registered.accountId()} target="_blank"  class="btn btn-warning waves-light waves-effect m-r-10">Проверить</a>
                                            <button class="btn btn-primary waves-light waves-effect" onclick={ctrl.handleOperation.bind(ctrl, 'createRegisteredUser', [])}>
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
                        <a data-toggle="collapse" data-parent="#accordion1" href="#sendMoneyDTOR">
                            <div class="portlet-heading bg-inverse">
                                <h3 class="portlet-title">
                                    Перевод средств с агента по распространению на зарегистрированного пользователя (50 {Conf.asset})
                                </h3>
                                <div class="clearfix"></div>
                            </div>
                        </a>
                        <div id="sendMoneyDTOR" class="panel-collapse collapse">
                            <div class="portlet-body">
                                <div class="list-group m-b-0">
                                    <li class="list-group-item">
                                        <div class="text-center">
                                            <a href={Conf.horizon_host + '/accounts/' + test.keypairs.registered.accountId()} target="_blank"  class="btn btn-warning waves-light waves-effect m-r-10">Проверить</a>
                                            <button class="btn btn-primary waves-light waves-effect" onclick={ctrl.handleOperation.bind(ctrl, 'sendMoney', [test.keypairs.distr, test.keypairs.registered.accountId(), 50])}>
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
                        <a data-toggle="collapse" data-parent="#accordion1" href="#createAgentMerchant">
                            <div class="portlet-heading bg-inverse">
                                <h3 class="portlet-title">
                                    Создание марчанта
                                </h3>
                                <div class="clearfix"></div>
                            </div>
                        </a>
                        <div id="createAgentMerchant" class="panel-collapse collapse">
                            <div class="portlet-body">
                                <div class="list-group m-b-0">
                                    <li class="list-group-item">
                                        <div class="text-center">
                                            <a href={Conf.horizon_host + '/accounts/' + test.keypairs.merchant.accountId()} target="_blank"  class="btn btn-warning waves-light waves-effect m-r-10">Проверить</a>
                                            <button class="btn btn-primary waves-light waves-effect" onclick={ctrl.handleOperation.bind(ctrl, 'createAgent', [test.keypairs.merchant.accountId(), StellarSdk.xdr.AccountType.accountMerchant().value])}>
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
                        <a data-toggle="collapse" data-parent="#accordion1" href="#sendMoneyATOM">
                            <div class="portlet-heading bg-inverse">
                                <h3 class="portlet-title">
                                    Перевод средств с анонимного пользователя на мерчанта (50 {Conf.asset})
                                </h3>
                                <div class="clearfix"></div>
                            </div>
                        </a>
                        <div id="sendMoneyATOM" class="panel-collapse collapse">
                            <div class="portlet-body">
                                <div class="list-group m-b-0">
                                    <li class="list-group-item">
                                        <div class="text-center">
                                            <a href={Conf.horizon_host + '/accounts/' + test.keypairs.merchant.accountId()} target="_blank"  class="btn btn-warning waves-light waves-effect m-r-10">Проверить</a>
                                            <button class="btn btn-primary waves-light waves-effect" onclick={ctrl.handleOperation.bind(ctrl, 'sendMoney', [test.keypairs.anonym, test.keypairs.merchant.accountId(), 50])}>
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
                        <a data-toggle="collapse" data-parent="#accordion1" href="#sendMoneyRTOM">
                            <div class="portlet-heading bg-inverse">
                                <h3 class="portlet-title">
                                    Перевод средств с зарегистрированного пользователя на мерчанта (50 {Conf.asset})
                                </h3>
                                <div class="clearfix"></div>
                            </div>
                        </a>
                        <div id="sendMoneyRTOM" class="panel-collapse collapse">
                            <div class="portlet-body">
                                <div class="list-group m-b-0">
                                    <li class="list-group-item">
                                        <div class="text-center">
                                            <a href={Conf.horizon_host + '/accounts/' + test.keypairs.merchant.accountId()} target="_blank"  class="btn btn-warning waves-light waves-effect m-r-10">Проверить</a>
                                            <button class="btn btn-primary waves-light waves-effect" onclick={ctrl.handleOperation.bind(ctrl, 'sendMoney', [test.keypairs.registered, test.keypairs.merchant.accountId(), 50])}>
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
                        <a data-toggle="collapse" data-parent="#accordion1" href="#sendMoneyDTOC">
                            <div class="portlet-heading bg-inverse">
                                <h3 class="portlet-title">
                                    Создание карты пополнения (50 {Conf.asset})
                                </h3>
                                <div class="clearfix"></div>
                            </div>
                        </a>
                        <div id="sendMoneyDTOC" class="panel-collapse collapse">
                            <div class="portlet-body">
                                <div class="list-group m-b-0">
                                    <li class="list-group-item">
                                        <div class="text-center">
                                            <a href={Conf.horizon_host + '/accounts/' + test.keypairs.card.accountId()} target="_blank"  class="btn btn-warning waves-light waves-effect m-r-10">Проверить</a>
                                            <button class="btn btn-primary waves-light waves-effect" onclick={ctrl.handleOperation.bind(ctrl, 'createCard', [50])}>
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
                        <a data-toggle="collapse" data-parent="#accordion1" href="#useCard">
                            <div class="portlet-heading bg-inverse">
                                <h3 class="portlet-title">
                                    Использовать карту пополнения анонимным пользователем (5 {Conf.asset})
                                </h3>
                                <div class="clearfix"></div>
                            </div>
                        </a>
                        <div id="useCard" class="panel-collapse collapse">
                            <div class="portlet-body">
                                <div class="list-group m-b-0">
                                    <li class="list-group-item">
                                        <div class="text-center">
                                            <a href={Conf.horizon_host + '/accounts/' + test.keypairs.card.accountId()} target="_blank"  class="btn btn-warning waves-light waves-effect m-r-10">Проверить</a>
                                            <button class="btn btn-primary waves-light waves-effect" onclick={ctrl.handleOperation.bind(ctrl, 'useCard', [test.keypairs.card, test.keypairs.anonym.accountId(), 5])}>
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
                        <a data-toggle="collapse" data-parent="#accordion1" href="#restrictAgent">
                            <div class="portlet-heading bg-inverse">
                                <h3 class="portlet-title">
                                    Заблокировать вх./ исх. платежи для агента по распространению
                                </h3>
                                <div class="clearfix"></div>
                            </div>
                        </a>
                        <div id="restrictAgent" class="panel-collapse collapse">
                            <div class="portlet-body">
                                <div class="list-group m-b-0">
                                    <li class="list-group-item">
                                        <div class="text-center">
                                            <a href={Conf.horizon_host + '/accounts/' + test.keypairs.distr.accountId() + '/traits'} target="_blank"  class="btn btn-warning waves-light waves-effect m-r-10">Проверить</a>
                                            <button class="btn btn-primary waves-light waves-effect" onclick={ctrl.handleOperation.bind(ctrl, 'restrictAgent', [test.keypairs.distr.accountId(), true, true])}>
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
                        <a data-toggle="collapse" data-parent="#accordion1" href="#unrestrictAgent">
                            <div class="portlet-heading bg-inverse">
                                <h3 class="portlet-title">
                                    Разблокировать вх./ исх. платежи для агента по распространению
                                </h3>
                                <div class="clearfix"></div>
                            </div>
                        </a>
                        <div id="unrestrictAgent" class="panel-collapse collapse">
                            <div class="portlet-body">
                                <div class="list-group m-b-0">
                                    <li class="list-group-item">
                                        <div class="text-center">
                                            <a href={Conf.horizon_host + '/accounts/' + test.keypairs.distr.accountId() + '/traits'} target="_blank"  class="btn btn-warning waves-light waves-effect m-r-10">Проверить</a>
                                            <button class="btn btn-primary waves-light waves-effect" onclick={ctrl.handleOperation.bind(ctrl, 'restrictAgent', [test.keypairs.distr.accountId(), false, false])}>
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
                        <a data-toggle="collapse" data-parent="#accordion1" href="#createInvoice">
                            <div class="portlet-heading bg-inverse">
                                <h3 class="portlet-title">
                                    Создать инвойс анонимным пользователем на сумму 10 {Conf.asset}
                                </h3>
                                <div class="clearfix"></div>
                            </div>
                        </a>
                        <div id="createInvoice" class="panel-collapse collapse">
                            <div class="portlet-body">
                                <div class="list-group m-b-0">
                                    <li class="list-group-item">
                                        <div class="text-center">
                                            {
                                                ctrl.keypairs.invoice.code ?
                                                    <a href={Conf.riak_check + '/buckets/invoices/keys/' + ctrl.keypairs.invoice.code} target="_blank"  class="btn btn-warning waves-light waves-effect m-r-10">Проверить</a>
                                                    :
                                                    ''
                                            }
                                            <button class="btn btn-primary waves-light waves-effect" onclick={ctrl.handleOperation.bind(ctrl, 'createInvoice', [test.keypairs.anonym, 10])}>
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
            {
                ctrl.keypairs.invoice.code ?
                    <div class="row">
                        <div class="col-md-8 col-md-offset-2">
                            <div class="portlet">
                                <a data-toggle="collapse" data-parent="#accordion1" href="#getInvoice">
                                    <div class="portlet-heading bg-inverse">
                                        <h3 class="portlet-title">
                                            Получить инвойс зарегистрированным пользователем
                                        </h3>
                                        <div class="clearfix"></div>
                                    </div>
                                </a>
                                <div id="getInvoice" class="panel-collapse collapse">
                                    <div class="portlet-body">
                                        <div class="list-group m-b-0">
                                            <li class="list-group-item">
                                                <div class="text-center">
                                                    {
                                                        ctrl.keypairs.invoice.code ?
                                                            <a href={Conf.riak_check + '/buckets/invoices/keys/' + ctrl.keypairs.invoice.code} target="_blank"  class="btn btn-warning waves-light waves-effect m-r-10">Проверить</a>
                                                            :
                                                            ''
                                                    }
                                                    <button class="btn btn-primary waves-light waves-effect" onclick={ctrl.handleOperation.bind(ctrl, 'getInvoice', [test.keypairs.registered, ctrl.keypairs.invoice.code])}>
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
                    :
                    ''
            }
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
    console.error(err);

    if (typeof err != 'undefined' &&
        typeof err.response != 'undefined' &&
        typeof err.response.data != 'undefined' &&
        typeof err.response.data.extras != 'undefined' &&
        typeof err.response.data.title != 'undefined' &&
        typeof err.response.data.extras.result_codes != 'undefined'
    ) {
        return m.flashError(err.response.data.title + ': ' + JSON.stringify(err.response.data.extras.result_codes));
    } else if (typeof err != 'undefined' &&
        typeof err.description != 'undefined') {
        return m.flashError(err.description);
    } else {
        return m.flashError(err);
    }

}