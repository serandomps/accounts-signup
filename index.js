var dust = require('dust')();
var serand = require('serand');

var USERS_API = 'https://accounts.serandives.com/apis/v/users';

dust.loadSource(dust.compile(require('./template'), 'accounts-signup'));

module.exports = function (sandbox, fn, options) {
    dust.render('accounts-signup', {}, function (err, out) {
        if (err) {
            return;
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
                error: function () {

                }
            });
        });
        fn(false, function () {
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
