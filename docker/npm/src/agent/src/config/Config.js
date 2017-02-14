var Localize = require('localize');
var Locales = require('../locales/translations.js');

var conf = {
    master_key:         process.env.MASTER_KEY,
    keyserver_host:     process.env.KEYSERVER_HOST,
    horizon_host:       process.env.HORIZON_HOST,
    api_url:            process.env.API_HOST
};

conf.masker = require('vanilla-masker');

conf.phone = {
    view_mask:  "+99 (999) 999-99-99",
    db_mask:    "999999999999",
    length:     10,
    prefix:     "+38"
};

conf.horizon = new StellarSdk.Server(conf.horizon_host);

conf.onpage = 10;

conf.pagination = {
    limit: 10
};

conf.locales = Locales;

conf.loc = new Localize(conf.locales);
conf.loc.throwOnMissingTranslation(false);
conf.loc.userLanguage = (localStorage.getItem('locale')) ? (localStorage.getItem('locale')) :
    (navigator.language || navigator.userLanguage).toLowerCase().split('-')[0];
conf.loc.setLocale(conf.loc.userLanguage);
conf.current_language = conf.loc.userLanguage;

conf.loc.changeLocale = function (locale, e) {
    e.preventDefault();
    m.startComputation();
    conf.loc.setLocale(locale);
    localStorage.setItem('locale', locale);
    conf.current_language = locale;
    m.endComputation();
};
conf.tr = conf.loc.translate; //short alias for translation

module.exports = conf;