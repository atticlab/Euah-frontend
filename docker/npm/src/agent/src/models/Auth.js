var Conf = require('../config/Config.js');
var Errors = require('../errors/Errors.js');

var Auth = {

    keypair:    m.prop(false),
    assets:     m.prop([]),
    balances:   m.prop([]),
    wallet:     m.prop(false),
    username:   m.prop(false),
    api:        m.prop(false),
    ttl:        m.prop(0),
    time_live:  m.prop(0),

    initAgentAssets: function () {

        return Auth.loadAccountById(Auth.keypair().accountId())
            .then(account_data => {
                m.startComputation();
                Auth.assets([]);
                account_data.balances.map(function(balance) {
                    if (typeof balance.asset_code != 'undefined') {
                        Auth.assets().push(balance.asset_code);
                    }
                });
                m.endComputation();
            })
    },

    initAgentBalances: function () {

        return Auth.loadAccountById(Auth.keypair().accountId())
            .then(account_data => {
                m.startComputation();
                Auth.balances([]);
                account_data.balances.map(function(balance) {
                    if (typeof balance.asset_code != 'undefined') {
                        Auth.balances().push(balance);
                    }
                });
                m.endComputation();
            })
    },

    loadAccountById: function (id) {
        return Conf.horizon.accounts()
            .accountId(id)
            .call();
    },

    login: function (login, password) {

        var wallet_data = null;

        return StellarWallet.getWallet({
            server: Conf.keyserver_host + '/v2',
            username: login,
            password: password
        }).then(function (wallet) {
            wallet_data = wallet;

            return Auth.loadAccountById(StellarSdk.Keypair.fromSeed(wallet_data.getKeychainData()).accountId());
        }).then(function (account_data) {
            if (account_data.type_i != StellarSdk.xdr.AccountType.accountDistributionAgent().value) {
                return m.flashError(Conf.tr('Bad account type'));
            } else {
                m.startComputation();
                Auth.wallet(wallet_data);
                Auth.keypair(StellarSdk.Keypair.fromSeed(wallet_data.getKeychainData()));
                Auth.username(wallet_data.username);
                Auth.api(new StellarWallet.Api(Conf.api_url, Auth.keypair()));
                Auth.api().initNonce()
                .then(function(ttl){
                    Auth.ttl(ttl);
                    Auth.time_live(Number(ttl));
                    return Auth.initAgentAssets();
                }).then(function(){
                    return Auth.initAgentBalances();
                })

                m.endComputation();
            }
        })
    },

    logout: function () {
        window.location.href = "/";
    },

};

module.exports = Auth;