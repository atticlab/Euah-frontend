var Conf = require('../config/Config.js'),
    Navbar = require('../components/Navbar.js'),
    Helpers = require('../components/Helpers.js'),
    Session = require('../models/Session.js'),
    Footer = require('../components/Footer.js');

module.exports = {
    controller: function () {
        var ctrl = this;

        this.account_id = m.route.param('account_id');
        this.payments = m.prop([]);
        this.payments_amount = m.prop([]);
        this.avg = m.prop(null);
        this.date = m.prop(0);

        this.updatePaymentsStatistic = function () {
            m.onLoadingStart();
            return new Promise(function(resolve){
                if (ctrl.payments().length) {
                    let avg = 0;
                    ctrl.payments().map(function (payment) {
                        if (payment.from == ctrl.account_id) {
                            avg += payment.amount * 1;
                        }
                    });

                    avg /= ctrl.payments().length;

                    m.startComputation();
                    ctrl.avg(avg);
                    m.endComputation();
                    m.onLoadingEnd();
                }

                return resolve();
            })
        };

        this.getPayments = function () {
            m.onLoadingStart();
            return new Promise(function(resolve, reject) {
                Conf.horizon.payments()
                    .forAccount(ctrl.account_id)
                    .limit(100)
                    .order('desc')
                    .call()
                    .then(function (result) {
                        if (!_.isEmpty(result.records)) {
                            _.each(result.records.reverse(), function (res) {
                                if (ctrl.account_id == res.from) {
                                    m.startComputation();

                                    ctrl.payments().unshift(res);
                                    ctrl.payments_amount().unshift(res.amount);
                                    while (ctrl.payments().length > Conf.limit) {
                                        ctrl.payments().pop();
                                        ctrl.payments_amount().pop();
                                    }

                                    m.endComputation();
                                }

                            });
                            Helpers.buildPaymentsChart(ctrl.payments_amount());
                        };
                    })
                    .then(function () {
                        Conf.horizon.payments()
                            .cursor('now')
                            .stream({
                                onmessage: function (message) {
                                    var res = message.data ? JSON.parse(message.data) : message;
                                    if (ctrl.account_id == res.from) {
                                        m.startComputation();
                                        ctrl.payments().unshift(res);
                                        ctrl.payments_amount().unshift(res.amount);
                                        while (ctrl.payments().length > Conf.limit) {
                                            ctrl.payments().pop();
                                            ctrl.payments_amount().pop();
                                        }

                                        m.endComputation();

                                        Helpers.buildPaymentsChart(ctrl.payments_amount());
                                        ctrl.updatePaymentsStatistic();
                                    }
                                },
                                onerror: function (error) {
                                }
                            });
                    })
                    .then(function () {
                        m.onLoadingEnd();
                    })
                    .then(function () {
                        resolve();
                    })
                    .catch(function (err) {
                        console.error(err);
                        reject(err);
                    })
            });
        };

        this.getPayments()
            .then(ctrl.updatePaymentsStatistic)

    },

    view: function (ctrl) {
        return <div id="wrapper">
            {m.component(Navbar)}
            <div class="content-page">
                <div class="wrapper">
                    <div class="container">
                        <div class="row">
                            <div class="row">
                                <div class="col-lg-offset-4 col-lg-4">
                                    <div class="card-box">
                                        <h4 class="m-t-0 header-title">
                                            <b>
                                                {Conf.tr('Average')}
                                            </b>
                                        </h4>
                                        <h1>
                                            {
                                                ctrl.avg() !== null ?
                                                    parseFloat(ctrl.avg()).toFixed(2)
                                                    :
                                                    'Wait for data...'
                                            }
                                        </h1>
                                    </div>
                                </div>
                                <div class="col-lg-12">
                                    <div class="card-box">
                                        <h4 class="m-t-0 header-title">
                                            <b>
                                                {Conf.tr('Last transactions')}
                                            </b>
                                        </h4>
                                        <div id="smil-left-animations" class="ct-chart ct-golden-section"></div>
                                    </div>
                                </div>
                            </div>

                            <div class="card-box">
                                <h4 class="m-t-0 header-title">
                                    {Conf.tr('Payments')}
                                </h4>
                                <table class="table table-striped m-0">
                                    <thead>
                                        <tr>
                                            <th>
                                                {Conf.tr('Transaction ID')}
                                            </th>
                                            <th>
                                                {Conf.tr('Temperature')}
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {
                                        ctrl.payments().map(function(payment){
                                            switch (payment.type_i) { //check the type of the 1st op
                                                case (StellarSdk.xdr.OperationType.payment().value): {
                                                    return <tr>
                                                        <td><a href={"/transaction/" + payment._links.transaction.href.split(/[\/ ]+/).pop()} config={m.route}>{payment.id}</a></td>
                                                        <td>
                                                            <div class="label label-success">
                                                                {
                                                                    parseFloat(payment.amount).toFixed(2)
                                                                }
                                                                C
                                                            </div>
                                                        </td>
                                                    </tr>
                                                }
                                            }
                                        })
                                    }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {m.component(Footer)}
        </div>
    }
};