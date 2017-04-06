var Conf = require('../config/Config.js');
var Navbar = require('../components/Navbar.js');
var Auth = require('../models/Auth.js');

var Invoice = module.exports = {

    controller: function () {
        var ctrl = this;

        if (!Auth.keypair()) {
            return m.route('/');
        }

        Conf.SmartApi.Api.refreshNonce();

        //Exchange agent of our ledger
        this.systemExchangeAgent = m.prop(null);
        this.banks = m.prop([]);

        this.infoDestBank = m.prop(m.prop(m.route.param('asset') ? m.route.param('asset') : ''));
        this.infoAsset = m.prop(m.prop(m.route.param('asset') ? m.route.param('asset') : ''));
        this.infoAmount = m.prop(m.route.param("amount") ? m.route.param("amount") : '');
        this.infoAccount = m.prop(m.route.param("account") ? m.route.param("account") : '');

        this.initialize = function () {
            ctrl.initializeSystemExchangeAgent().then(ctrl.getBankList);
        };

        this.initializeSystemExchangeAgent = function () {
            m.onLoadingStart();
            return m.request({method: "GET", url: Conf.opium_host + '/api/banks?master_id=' + Conf.master_key})
                .then(response => {
                    //TODO: check response
                    m.startComputation();
                    ctrl.systemExchangeAgent(response.agent_data.agent_id);
                    m.endComputation();
                    m.onLoadingEnd();
                })
                .catch(function (err) {
                    console.log(err);
                    m.flashError(Conf.tr('Your bank is not supported for external payments'));
                })
        };

        this.getBankList = function () {
            m.onLoadingStart();
            return m.request({method: "GET", url: Conf.opium_host + '/api/banks'})
                .then(banks => {
                    //TODO: check response
                    m.startComputation();
                    banks.map(function (bank) {
                        if (bank.master_id != Conf.master_key) {
                            ctrl.banks().push(bank);
                        }
                    });
                    m.endComputation();
                    m.onLoadingEnd();
                })
                .catch(function (err) {
                    console.log(err);
                    m.flashError(Conf.tr('Can not load banks list'));
                })
        };

        this.initialize();

        this.processPayment = function (e) {
            e.preventDefault();

            var destBank = e.target.destBank.value;
            var accountId = e.target.account.value;
            var amount = e.target.amount.value;
            var asset = e.target.asset.value;

            m.startComputation();
            ctrl.infoDestBank(destBank);
            ctrl.infoAccount(accountId);
            ctrl.infoAmount(amount);
            ctrl.infoAsset(asset);
            m.endComputation();


            if (!destBank) {
                return m.flashError(Conf.tr("Check receiver bank"));
            }

            if (!StellarSdk.Keypair.isValidPublicKey(destBank)) {
                return m.flashError(Conf.tr("Receiver bank account is invalid"));
            }

            if (!accountId) {
                return m.flashError(Conf.tr("Check receiver account"));
            }

            if (!StellarSdk.Keypair.isValidPublicKey(accountId)) {
                return m.flashError(Conf.tr("Receiver account is invalid"));
            }

            m.startComputation();
            m.onLoadingStart();

            return Conf.horizon.loadAccount(Auth.keypair().accountId())
                .then(function (source) {
                    var tx = new StellarSdk.TransactionBuilder(source)
                        .addOperation(StellarSdk.Operation.externalPayment({
                            exchangeAgent: ctrl.systemExchangeAgent(),
                            destinationBank: destBank,
                            destinationAccount: accountId,
                            amount: parseFloat(amount).toFixed(2),
                            asset: new StellarSdk.Asset(asset, Conf.master_key)
                        }))
                        .build();

                    tx.sign(Auth.keypair());

                    return Conf.horizon.submitTransaction(tx);
                })
                .then(function () {
                    m.flashSuccess(Conf.tr("External transfer successfully sent for handling"));
                })
                .catch(function (err) {
                    console.error(err);
                    m.flashError(Conf.tr("Cannot make external transfer"));
                })
                .then(function () {
                    ctrl.infoDestBank('');
                    ctrl.infoAsset('');
                    ctrl.infoAmount('');
                    ctrl.infoAccount('');
                    m.endComputation();
                    Conf.SmartApi.Api.refreshNonce();
                });
        }
    },

    view: function (ctrl) {
        return [m.component(Navbar),
            <div class="wrapper">
                <div class="container">
                    {
                        ctrl.systemExchangeAgent() ?
                            ctrl.banks().length ?
                                <div class="row">
                                    <form class="col-lg-6" onsubmit={ctrl.processPayment.bind(ctrl)}>
                                        <div class="panel panel-color panel-primary">
                                            <div class="panel-heading">
                                                <h3 class="panel-title">{Conf.tr("Transfer money")}</h3>
                                            </div>
                                            <div class="panel-body">
                                                <div class="form-group">
                                                    <label>{Conf.tr("Select external bank")}</label>
                                                    <select name="destBank" required="required" class="form-control"
                                                            value={ctrl.infoDestBank()}
                                                    >
                                                        {
                                                            ctrl.banks().map(function (bank) {
                                                                return <option value={bank.master_id}>{bank.title} [{bank.horizon_host}]</option>
                                                            })
                                                        }
                                                    </select>
                                                </div>
                                                <div class="form-group">
                                                    <label>{Conf.tr("Account ID")}</label>
                                                    <input name="account"
                                                           oninput={m.withAttr("value", ctrl.infoAccount)} pattern=".{56}"
                                                           title={Conf.tr("Account ID should have 56 symbols")}
                                                           class="form-control"
                                                           value={ctrl.infoAccount()}/>
                                                </div>
                                                <div class="form-group">
                                                    <label>{Conf.tr("Amount")}</label>
                                                    <input type="number" required="required" name="amount"
                                                           min="0.01"
                                                           step="0.01"
                                                           placeholder="0.00"
                                                           class="form-control"
                                                           oninput={m.withAttr("value", ctrl.infoAmount)}
                                                           value={ctrl.infoAmount()}/>
                                                </div>
                                                <div class="form-group">
                                                    <label>{Conf.tr("Asset")}</label>
                                                    <select name="asset" required="required" class="form-control">
                                                        {Auth.assets().map(function (asset) {
                                                            return <option
                                                                value={asset}
                                                                selected={ctrl.infoAsset() && ctrl.infoAsset() == asset ? 'selected' : ''}
                                                            >
                                                                {asset}
                                                            </option>
                                                        })}
                                                    </select>
                                                </div>
                                                <div class="form-group">
                                                    <button class="btn btn-primary btn-custom">{Conf.tr("Transfer")}</button>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                            </div>
                                :
                                <div>
                                    <p>{Conf.tr('No banks are available for payment')}</p>
                                </div>
                        :
                        <div class="row">
                            <p>{Conf.tr('Wait for initializing')}</p>
                        </div>
                    }
                </div>
            </div>
        ];
    }

};