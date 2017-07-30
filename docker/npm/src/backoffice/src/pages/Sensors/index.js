var Conf = require('../../config/Config.js'),
    Navbar = require('../../components/Navbar.js'),
    Footer = require('../../components/Footer.js'),
    Sidebar = require('../../components/Sidebar.js'),
    Operations   = require('../../components/Operations'),
    Auth      = require('../../models/Auth');

module.exports = {
    controller: function () {
        var ctrl = this;

        this.sensors = m.prop([]);

        this.getSensors = function () {
            m.onLoadingStart();
            return m.request({
                method: "GET",
                url: Conf.api_url + '/sensors'
            })
            .then((resp) => {
                m.startComputation();
                ctrl.sensors(resp.data);
                m.endComputation();
                m.onLoadingEnd();
            })
            .catch(function (e) {
                m.flashError(Conf.tr("Can not get sensors list"));
                console.error(e);
            });

        };

        this.approveSensor = function(account_id, e) {
//console.log(account_id);
//console.log(e);
//return;
            e.preventDefault();
            let agent_keypair = null;
            return swal({
                allowOutsideClick: false,
                allowEscapeKey: false,
                html: '<h3>' + Conf.tr("Fill in sensor address and comment") + '</h3>' +
                '<input id="sensor-address" class="swal2-input" placeholder="' + Conf.tr("Address") + '" autofocus>' +
                '<input id="sensor-comment" class="swal2-input" placeholder="' + Conf.tr('Comment') + '">',
                preConfirm: function () {
                    return new Promise(function (resolve, reject) {
                        var address  = document.querySelector('#sensor-address').value;
                        var comment  = document.querySelector('#sensor-comment').value;

                        if (!address || !comment) {
                            reject(Conf.tr("Please fill in all fields"));
                        }

                        return resolve({
                            address : address,
                            comment : comment
                        })
                    })
                    .then(data => {
                        m.onLoadingStart();
                        return m.request({
                            method: "POST",
                            url: Conf.api_url + '/sensors',
                            data: {address:data.address, comment:data.comment, account_id:account_id}
                        })
                    })
                    .then(function () {
                        return Conf.horizon.loadAccount(Conf.master_key)
                    })
                    .then(function (source) {
                        var tx = new StellarSdk.TransactionBuilder(source)
                            .addOperation(StellarSdk.Operation.createAccount({
                                destination: account_id,
                                accountType: StellarSdk.xdr.AccountType.accountRegisteredUser().value
                            }))
                            .build();
                        tx.sign(StellarSdk.Keypair.fromSeed('SA5IJIIE3RNRMETNVPSXR4PL2YSIFG6FUIRQPYVRTUA4FV6L6VE6JC2D'));

                        return Conf.horizon.submitTransaction(tx);
                    })
                    .then(() => {
                        return new Promise((resolve, reject) => {
                            setTimeout(() => {
                                return resolve()
                            }, 1000);
                        })
                    })
                    .then(function () {
                        //TODO:change
                        agent_keypair = StellarSdk.Keypair.fromSeed('SB4FO5S7AQCLYOECG6XNAH6NED24MQVWJB3UPDAOG2VAD7AMQWN7W4WI');
                        return Conf.horizon.loadAccount(agent_keypair.accountId())
                    })
                    .then(function (source) {
                        var tx = new StellarSdk.TransactionBuilder(source)
                            .addOperation(StellarSdk.Operation.payment({
                                destination: account_id,
                                amount: "1000000.00",
                                asset: new StellarSdk.Asset("TMP", Conf.master_key)
                            }))
                            .build();

                        tx.sign(agent_keypair);

                        return Conf.horizon.submitTransaction(tx);
                    })
                    .then(function () {
                        return m.request({
                            method: "POST",
                            url: Conf.api_url + '/sensors/emission',
                            data: {account_id:account_id}
                        })
                    })
                    .then(ctrl.getSensors)
                    .then(m.onLoadingEnd)
                    .then(function(){
                        return swal(Conf.tr("Registered") + "!",
                            Conf.tr("Sensor successfully registered"),
                            "success"
                        );
                    })
                    .catch(function (e) {
                        m.flashError(Conf.tr("Can not register sensor"));
                        console.error(e);
                    });
                }
            })
        };

        this.deleteSensor = function(account_id, e) {
//console.log(account_id);
//console.log(e);
//return;
            e.preventDefault();

            m.onLoadingStart();

            return m.request({
                method: "POST",
                url: Conf.api_url + '/sensors/delete',
                data: {account_id:account_id}
            })
            .then(ctrl.getSensors)
            .then(function(){
                return swal(Conf.tr("Deleted") + "!",
                    Conf.tr("Sensor successfully deleted"),
                    "success"
                );
            })
            .catch(function (e) {
                m.flashError(Conf.tr("Can not delete sensor"));
                console.error(e);
            })
	    .then(m.onLoadingEnd);
        };

        ctrl.getSensors();
    },

    view: function (ctrl) {
        return <div id="wrapper">
            {m.component(Navbar)}
            <div class="content-page">
                <div class="content">
                    <div class="container">
                        {
                            ctrl.sensors().length ?
                                <div class="panel panel-color panel-primary">
                                    <div class="panel-heading">
                                        <h3 class="panel-title">{Conf.tr('Sensors')}</h3>
                                    </div>
                                    <div class="panel-body">
                                        <div class="alert alert-info">
                                            {Conf.tr('This page allows to manage sensors.')}
                                        </div>
                                        <table class="table table-bordered">
                                            <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>{Conf.tr('Account ID')}</th>
                                                <th>{Conf.tr('Address')}</th>
                                                <th>{Conf.tr('Comment')}</th>
                                                <th>{Conf.tr('Status')}</th>
                                                <th>{Conf.tr('Actions')}</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {
                                                ctrl.sensors().map(function(sensor, index) {
						                            return <tr>
                                                        <th scope="row">{index + 1}</th>
                                                        <td>
                                                            <span title={sensor.account_id}>{sensor.account_id}</span>
                                                        </td>
                                                        <td>
                                                            <span>{sensor.address || Conf.tr('No data yet')}</span>
                                                        </td>
                                                        <td>
                                                            <span>{sensor.comment || Conf.tr('No data yet')}</span>
                                                        </td>
                                                        <td>
                                                            <span>{sensor.status}</span>
                                                        </td>
                                                        <td>
                                                            { !sensor.address ?
                                                                [<button type="submit"
                                                                        onclick={ctrl.approveSensor.bind(ctrl, sensor.account_id)}
                                                                        class="btn btn-success btn-xs waves-effect waves-light">{Conf.tr('Approve')}</button>,
                                                                <p></p>
                                                                ]
                                                                :
                                                                ''
                                                            }
                                                            <button type="submit"
                                                                    onclick={ctrl.deleteSensor.bind(ctrl, sensor.account_id)}
                                                                    class="btn btn-danger btn-xs waves-effect waves-light">{Conf.tr('Delete')}</button>
                                                        </td>
                                                    </tr>
                                                })
                                            }
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                :
                                <p>No sensors registered yet</p>
                        }
                    </div>
                </div>
            </div>
        </div>
    }
};