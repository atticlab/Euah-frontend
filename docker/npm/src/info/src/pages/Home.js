var Conf = require('../config/Config.js'),
    Navbar = require('../components/Navbar.js'),
    Helpers = require('../components/Helpers.js'),
    Footer = require('../components/Footer.js');

module.exports = {
    controller: function () {
        var ctrl = this;

        this.sensors = m.prop([])

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

    },

    view: function (ctrl) {
        return <div id="wrapper">
            <img height="1" src="http://smartmoney.com.ua/images/1x1.png"/>
            {m.component(Navbar)}
            <div class="content-page">
                <div class="content">
                    <div class="container">
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
                                    {ctrl.sensors().map(function(sensor, index) {
                                        return <tr>
                                            <th scope="row">{index + 1}</th>
                                            <td>
                                                <span title={sensor.account_id}>
                                                    <a href={"/account/" + sensor.account_id}
                                                       config={m.route}>{sensor.account_id}</a>
                                                </span>
                                            </td>
                                            <td>
                                                <span>{sensor.address || Conf.tr('No data yet')}</span>
                                            </td>
                                            <td>
                                                <span>{sensor.comment || Conf.tr('No data yet')}</span>
                                            </td>
                                            <td>
                                                { !sensor.address.length ?
                                                    <button type="submit"
                                                            onclick={ctrl.approveSensor().bind(ctrl, sensor.account_id)}
                                                            class="btn btn-success btn-xs waves-effect waves-light">{Conf.tr('Approve')}</button>
                                                    :
                                                    ''
                                                }
                                                <button type="submit"
                                                        onclick={ctrl.deleteSensor.bind(ctrl, sensor.account_id)}
                                                        class="btn btn-danger btn-xs waves-effect waves-light">{Conf.tr('Delete')}</button>
                                            </td>
                                        </tr>
                                    })}
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