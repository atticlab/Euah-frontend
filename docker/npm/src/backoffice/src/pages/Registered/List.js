var Conf    = require('../../config/Config.js'),
    Navbar  = require('../../components/Navbar.js'),
    Footer  = require('../../components/Footer.js'),
    Sidebar = require('../../components/Sidebar.js'),
    Auth    = require('../../models/Auth'),
    Helpers = require('../../models/Helpers'),
    Pagination  = require('../../components/Pagination.js'),
    Session = require('../../models/Session.js');

module.exports = {
    controller: function () {
        var ctrl = this;
        if (!Auth.username()) {
            return m.route('/');
        }

        this.is_initialized = m.prop(false);

        this.page = (m.route.param('page')) ? m.prop(Number(m.route.param('page'))) : m.prop(1);
        this.limit = Conf.pagination.limit;
        this.offset = (ctrl.page() - 1) * ctrl.limit;
        this.pagination_data = m.prop({func: "getRegusersList", page: ctrl.page()});

        this.reg_users = m.prop([]);

        this.name        = m.prop(false);
        this.surname     = m.prop(false);
        this.middle_name = m.prop(false);

        this.getRegisteredUsers = function () {
            m.onLoadingStart();
            Auth.api().getRegusersList({limit: ctrl.limit, offset: ctrl.offset})
                .then(function(reg_users){
                    if (typeof reg_users.data != 'undefined') {
                        m.startComputation();
                        ctrl.reg_users(reg_users.data);
                        ctrl.is_initialized(true);
                        m.endComputation();
                    } else {
                        console.error('Unexpected response');
                        console.error(reg_users);
                    }
                })
                .catch(function(error) {
                    console.error(error);
                    return m.flashApiError(error);
                })
                .then(function() {
                    m.onLoadingEnd();
                });
        };

        this.decommission = function (data, e) {

            return Conf.horizon.loadAccount(data.account_id)
                .then(function (source) {
                    var tx = new StellarSdk.TransactionBuilder(source)
                        .addOperation(StellarSdk.Operation.accountMerge({
                            destination: Conf.master_key
                        }))
                        .build();

                    tx.sign(Auth.keypair());

                    return Conf.horizon.submitTransaction(tx);
                })
                .then(function () {
                    m.flashSuccess(Conf.tr("Decommission successful"));
                })
                .catch(function (err) {
                    console.log(err);
                    m.flashError(Conf.tr("Cannot make transfer"));
                })
        };

        this.getRegisteredUsers();
    },

    view: function (ctrl) {
        return <div id="wrapper">
            {m.component(Navbar)}
            {m.component(Sidebar)}
            <div class="content-page">
                <div class="content">
                    <div class="container">
                        {(ctrl.is_initialized()) ?
                            <div>
                                {(ctrl.reg_users().length) ?
                                    <div class="panel panel-color panel-primary">
                                        <div class="panel-heading">
                                            <h3 class="panel-title">{Conf.tr('Registered users')}</h3>
                                        </div>
                                        <div class="panel-body">
                                            <table class="table table-bordered">
                                                <thead>
                                                <tr>
                                                    <th>{Conf.tr("ID")}</th>
                                                    <th>{Conf.tr("Created")}</th>
                                                    <th>{Conf.tr("Name")}</th>
                                                    <th>{Conf.tr("Account ID")}</th>
                                                    <th>{Conf.tr('Information')}</th>
                                                    <th>{Conf.tr('Currency')}</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {ctrl.reg_users().map(function (reg_user) {
                                                    return <tr>
                                                        <td>
                                                            {reg_user.id}
                                                        </td>
                                                        <td>
                                                            <span>{Helpers.getDateFromTimestamp(reg_user.created)}</span>
                                                        </td>
                                                        <td>
                                                            {reg_user.surname + ' ' + reg_user.name + ' ' + reg_user.middle_name}
                                                        </td>
                                                        <td>
                                                            {reg_user.account_id ?
                                                                <span title={reg_user.account_id}>{reg_user.account_id.substr(0, 30) + '...'} </span>
                                                                :
                                                                <span>{Conf.tr("Account ID is not approved yet")}</span>
                                                            }
                                                        </td>
                                                        <td>
                                                            {
                                                                reg_user.account_id ?
                                                                <button
                                                                    class="btn-xs btn-warning waves-effect waves-light"
                                                                    onclick={function(){
                                                                        Session.modal(
                                                                            <table class="table">
                                                                                <tr>
                                                                                    <td>{Conf.tr('ID')}:</td>
                                                                                    <td><code>{reg_user.id}</code></td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td>{Conf.tr('Passport')}:</td>
                                                                                    <td><code>{reg_user.passport}</code></td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td>{Conf.tr('IPN')}:</td>
                                                                                    <td><code>{reg_user.ipn_code}</code></td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td>{Conf.tr('Address')}:</td>
                                                                                    <td><code>{reg_user.address}</code></td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td>{Conf.tr('Phone')}:</td>
                                                                                    <td><code>{reg_user.phone}</code></td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td>{Conf.tr('E-mail')}:</td>
                                                                                    <td><code>{reg_user.email}</code></td>
                                                                                </tr>
                                                                            </table>
                                                                        , Conf.tr('About user'))
                                                                    }}
                                                                >
                                                                    {Conf.tr('Show data')}
                                                                </button>
                                                                :
                                                                '-'
                                                            }
                                                        </td>
                                                        <td>
                                                            <span title={Conf.tr("Asset")}>{reg_user.asset}</span>
                                                        </td>
                                                    </tr>
                                                })}
                                                </tbody>
                                            </table>
                                            {m.component(Pagination, {pagination: ctrl.pagination_data()})}
                                        </div>
                                    </div>
                                    :
                                    <div class="portlet">
                                        <div class="portlet-heading bg-warning">
                                            <h3 class="portlet-title">
                                                {Conf.tr('No registered users found')}
                                            </h3>
                                            <div class="portlet-widgets">
                                                <a data-toggle="collapse" data-parent="#accordion1" href="#bg-warning">
                                                    <i class="ion-minus-round"></i>
                                                </a>
                                                <span class="divider"></span>
                                                <a href="#" data-toggle="remove"><i class="ion-close-round"></i></a>
                                            </div>
                                            <div class="clearfix"></div>
                                        </div>
                                        <div id="bg-warning" class="panel-collapse collapse in">
                                            <div class="portlet-body">
                                                {Conf.tr('Please')}<a href='/registered/create' config={m.route}> {Conf.tr("create")}</a>!
                                            </div>
                                        </div>
                                    </div>
                                }
                            </div>
                            :
                            <div class="portlet">
                                <div class="portlet-heading bg-primary">
                                    <h3 class="portlet-title">
                                        {Conf.tr('Wait for data loading')}...
                                    </h3>
                                    <div class="portlet-widgets">
                                        <a data-toggle="collapse" data-parent="#accordion1" href="#bg-warning">
                                            <i class="ion-minus-round"></i>
                                        </a>
                                        <span class="divider"></span>
                                        <a href="#" data-toggle="remove"><i class="ion-close-round"></i></a>
                                    </div>
                                    <div class="clearfix"></div>
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>
            {m.component(Footer)}
        </div>
    }
};