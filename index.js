var dust = require('dust')();
var serand = require('serand');
var utils = require('utils');

var USERS_API = utils.resolve('accounts://apis/v/users');

dust.loadSource(dust.compile(require('./template'), 'accounts-signup'));

module.exports = function (sandbox, options, done) {
    dust.render('accounts-signup', {}, function (err, out) {
        if (err) {
            return done(err);
        }
        var elem = sandbox.append(out);
        $('.signup', elem).on('click', function () {
            $.ajax({
                url: USERS_API,
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({
                    email: $('.email', elem).val(),
                    password: $('.password', elem).val()
                }),
                dataType: 'json',
                success: function (data) {
                    serand.redirect('/signin');
                },
                error: function (xhr, status, err) {
                    console.error(err || status || xhr);
                }
            });
        });
        done(null, function () {
            $('.accounts-signup', sandbox).remove();
        });
    });
};

var user;
/*

 setTimeout(function () {
 var serand = require('serand');
 serand.emit('user', 'login', { username: 'ruchira'});
 }, 4000);*/
