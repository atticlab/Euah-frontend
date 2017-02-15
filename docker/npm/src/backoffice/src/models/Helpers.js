var Conf = require('../config/Config');
var Auth = require('../models/Auth');

var Helpers = {

    getDateOnlyFromTimestamp: function (timestamp) {

        if (!timestamp || !parseInt(timestamp)) {
            return '';
        }

        var d = new Date(timestamp * 1000);
        var year = d.getFullYear();
        var month = this.transformToTwoDigits(d.getMonth() + 1);
        var day = this.transformToTwoDigits(d.getDate());

        return [day, month, year].join('.');
    },

    getTimeFromSeconds: function (sec) {
        var dt = new Date();
        dt.setTime(sec*1000);
        var minutes = dt.getMinutes();
        var seconds = dt.getSeconds();
        if (minutes < 10) {
            minutes = "0" + minutes;
        }
        if (seconds < 10) {
            seconds = "0" + seconds;
        }
        return minutes + ":" + seconds;
    },

    getDateFromTimestamp: function (timestamp) {

        if (!timestamp || !parseInt(timestamp)) {
            return '';
        }

        var d = new Date(timestamp * 1000);
        var year = d.getFullYear();
        var month = this.transformToTwoDigits(d.getMonth() + 1);
        var day = this.transformToTwoDigits(d.getDate());
        var hours = this.transformToTwoDigits(d.getHours());
        var minutes = this.transformToTwoDigits(d.getMinutes());
        var seconds = this.transformToTwoDigits(d.getSeconds());

        return [day, month, year].join('.') + " " + [hours, minutes, seconds].join(':');
    },

    transformToTwoDigits: function (number) {
        return number.toString().length < 2 ? '0' + number : number;
    },

    getTextAgentType: function (type) {
        var prefix = 'account';
        var text_type = StellarSdk.xdr.AccountType._byValue.get(type).name;
        text_type = text_type.slice(prefix.length);
        return Conf.tr(text_type);
    },

    getAdminsList: function () {
        var admins = [];
        return new Promise(function (resolve, reject) {
            Conf.horizon.accounts().accountId(Conf.master_key)
                .call()
                .then(function (data) {
                    if (typeof data.signers == 'undefined') {
                        reject('Unexpected response');
                    }
                    data.signers.forEach(function (signer) {
                        if (signer.weight == Conf.roles.admin) {
                            admins.push(signer.public_key);
                        }
                    });
                    resolve(admins);
                })
                .catch(function (error) {
                    reject(error);
                })
        });
    },
    getEmissionKeysList: function () {
        var emmission_keys = [];
        return new Promise(function (resolve, reject) {
            Conf.horizon.accounts().accountId(Conf.master_key)
                .call()
                .then(function (data) {
                    if (typeof data.signers == 'undefined') {
                        reject('Unexpected response');
                    }
                    data.signers.forEach(function (signer) {
                        if (signer.weight == Conf.roles.emission) {
                            emmission_keys.push(signer.public_key);
                        }
                    });
                    resolve(emmission_keys);
                })
                .catch(function (error) {
                    reject(error);
                })
        });
    },

    deleteMasterSigner: function (account_id) {
            m.onLoadingStart();
            var adminKeyPair = null;
            return m.getPromptValue(Conf.tr("Enter password"))
                .then(function (pwd) {
                    return StellarWallet.getWallet({
                        server: Conf.keyserver_host + '/v2',
                        username: Auth.username(),
                        password: pwd
                    })
                })
                .then(function (wallet) {
                    adminKeyPair = StellarSdk.Keypair.fromSeed(wallet.getKeychainData());
                    return Conf.horizon.loadAccount(Conf.master_key);
                })
                .then(source => {
                    var tx = new StellarSdk.TransactionBuilder(source)
                        .addOperation(StellarSdk.Operation.setOptions({
                            signer: {
                                pubKey: account_id,
                                weight: 0,
                                signerType: StellarSdk.xdr.SignerType.signerGeneral().value
                            }
                        }))
                        .build();
                    tx.sign(adminKeyPair);
                    return Conf.horizon.submitTransaction(tx);
                })
                .then(function () {
                    return m.onLoadingEnd();
                })
                .catch(function (e) {
                    m.flashError(Conf.tr("Cannot delete signer"));
                    console.log(e);
                });
        },

    getEnrollmentStageStatus: function (stage_status) {
        return Conf.tr(Conf.enrollments_statuses[stage_status]);
    },
    capitalizeFirstLetter: function (string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    },
    getTextAccountType: function (value) {
        var textAccountType = 'Unknown';
        Conf.account_types.map(function (type) {
            if (type.code == value) {
                textAccountType = type.name;
            }
        });
        return textAccountType;
    },
    getCodeAccountType: function (value) {
        var codeAccountType = -1;
        Conf.account_types.map(function (type) {
            if (type.name == value) {
                codeAccountType = type.code.toString();
            }
        });
        return codeAccountType;
    },
    saveCommissionOperation: function (opts, flat, percent) {

        return Conf.horizon.loadAccount(Conf.master_key)
            .then(function (source) {
                var op = StellarSdk.Operation.setCommission(opts, flat.toString(), percent.toString());
                var tx = new StellarSdk.TransactionBuilder(source).addOperation(op).build();
                tx.sign(Auth.keypair());
                return Conf.horizon.submitTransaction(tx);
            })
            .then(function () {
                m.flashSuccess(Conf.tr("Saved successfully"));
            })
            .catch(err => {
                console.error(err);
                return m.flashError(Conf.tr('Can not save commission'));
            })
    },
    deleteCommissionOperation: function (opts) {

        return Conf.horizon.loadAccount(Conf.master_key)
            .then(function (source) {
                var op = StellarSdk.Operation.deleteCommission(opts);
                var tx = new StellarSdk.TransactionBuilder(source).addOperation(op).build();
                tx.sign(Auth.keypair());
                return Conf.horizon.submitTransaction(tx);
            })
            .then(function () {
                m.flashSuccess(Conf.tr("Deleted successfully"));
            })
            .catch(err => {
                console.error(err);
                return m.flashError(Conf.tr('Can not delete commission'));
            })
    },
    approveEnrollment: function (account_id, account_type, tx_trust, enrollment_id, e) {
            m.onLoadingStart();

            return Conf.horizon.loadAccount(Conf.master_key)
                .then(function (source) {
                    var tx = new StellarSdk.TransactionBuilder(source)
                        .addOperation(StellarSdk.Operation.createAccount({
                            destination: account_id,
                            accountType: account_type
                        }))
                        .build();
                    tx.sign(Auth.keypair());

                    return Conf.horizon.submitTransaction(tx);
                })
                .then(function () {
                    return Conf.horizon.submitTransaction(new StellarSdk.Transaction(tx_trust));
                })
                .then(function () {
                    return Auth.api().enrollmentApprove({id:enrollment_id});
                })
                .then(function () {
                    return m.flashSuccess(Conf.tr('Enrollment approved'));
                })
                .catch(function (error) {
                    console.error(error);
                    return m.flashApiError(error);
                })
                .then(function () {
                    m.onLoadingEnd();
                    m.route(m.route());
                });
    },
    makeEmission: function (account_id, amount, asset) {
        m.onLoadingStart();

        var username = '';
        var password = '';

        m.getPromptValue(Conf.tr("Enter emission auth username"))
            .then(function (entered_username) {
                username = entered_username;
                return m.getPromptValue(Conf.tr("Enter emission auth password"))
            })
            .then(function (entered_password) {
                password = entered_password;

                var xhrConfig = function(xhr) {
                    xhr.setRequestHeader("Authorization", "Basic " + btoa(username + ":" + password));
                }

                return m.request({
                    method: "POST",
                    url: Conf.emission_host + '/issue',
                    config: xhrConfig,
                    data: {accountId: account_id, amount:amount, asset:asset}
                });
            })
            .then(function (response) {
                console.log(response);
                return m.flashSuccess(Conf.tr('Emission success'));
            }).catch(function(error){
                console.error(error);
                return m.flashError(typeof error.err_msg != 'undefined' ? Conf.tr(error.err_msg) : Conf.tr('Cannot make emission'));
            }).then(function(){
                m.onLoadingEnd();
            })
    },

    encryptData: function (data, password) {
        if (typeof data !== 'string') {
            throw new TypeError('data must be a String.');
        }

        if (typeof password !== 'string') {
            throw new TypeError('password must be a String.');
        }

        var encrypted = sjcl.encrypt(password, data);
        return btoa(encrypted);
    },

    download: function (fileNameToSaveAs, textToWrite) {
        /* Saves a text string as a blob file */
        var ie     = navigator.userAgent.match(/MSIE\s([\d.]+)/),
            ie11   = navigator.userAgent.match(/Trident\/7.0/) && navigator.userAgent.match(/rv:11/),
            ieEDGE = navigator.userAgent.match(/Edge/g),
            ieVer  = (ie ? ie[1] : (ie11 ? 11 : (ieEDGE ? 12 : -1)));

        if (ie && ieVer < 10) {
            console.log("No blobs on IE ver<10");
            return;
        }

        var textFileAsBlob = new Blob([textToWrite], {
            type: 'text/plain'
        });

        if (ieVer > -1) {
            window.navigator.msSaveBlob(textFileAsBlob, fileNameToSaveAs);
        } else {

            var is_safari = false;

            var ua = navigator.userAgent.toLowerCase();
            if (ua.indexOf('safari') != -1) {
                if (ua.indexOf('chrome') == -1) {
                    is_safari = true;
                }
            }

            if (is_safari) {
                alert(Conf.tr("In Safari browser may be problems with downloading files. If Safari opened file in a new tab, instead of downloading, please click ⌘+S and save the file with the extension .smb (For example: file.smb)In Safari browser may be problems with downloading files. If Safari opened file in a new tab, instead of downloading, please click ⌘+S and save the file with the extension .smb (For example: file.smb)"));
            }

            var downloadLink = document.createElement("a");
            downloadLink.download = fileNameToSaveAs;
            downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
            downloadLink.onclick = function (e) {
                document.body.removeChild(e.target);
            };
            downloadLink.style.display = "none";
            document.body.appendChild(downloadLink);
            downloadLink.click();
        }
    },

    long2ip: function (ip) {
    //   example 1: long2ip( 3221234342 )
    //   returns 1: '192.0.34.166'

    if (!isFinite(ip)) {
        return false
    }

    return [ip >>> 24, ip >>> 16 & 0xFF, ip >>> 8 & 0xFF, ip & 0xFF].join('.')
}

};
module.exports = Helpers;