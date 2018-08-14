var dust = require('dust')();
var serand = require('serand');
var utils = require('utils');
var captcha = require('captcha');

var USERS_API = utils.resolve('accounts://apis/v/users');

dust.loadSource(dust.compile(require('./template'), 'accounts-signup'));

module.exports = function (sandbox, options, done) {
    var home = options.location || '/';
    var signin = 'accounts://signin';
    var suffix = '';
    var append = function (suff) {
        suffix += (suffix ? '&' : '?') + suff;
    }
    if (options.clientId) {
        append('client_id=' + options.clientId);
    }
    if (options.location) {
        append('redirect_uri=' + options.location);
    }
    signin += suffix;
    signin = utils.resolve(signin);
    dust.render('accounts-signup', {home: home, signin: signin}, function (err, out) {
        if (err) {
            return done(err);
        }
        var captchaId;
        sandbox.append(out);
        sandbox.on('click', '.accounts-signup .signup', function () {
            var el = $('.accounts-signin', sandbox);
            captcha.response(captchaId, function (err, captcha) {
                if (err) {
                    return console.error(err);
                }
                if (!captcha) {
                    return;
                }
                $.ajax({
                    url: USERS_API,
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify({
                        email: $('.email', el).val(),
                        password: $('.password', el).val()
                    }),
                    headers: {
                        'X-Captcha': captcha
                    },
                    dataType: 'json',
                    success: function (data) {
                        serand.redirect('/signin');
                    },
                    error: function (xhr, status, err) {
                        console.error(err || status || xhr);
                    }
                });
            });
            return false;
        });
        done(null, {
            clean: function () {
                $('.accounts-signup', sandbox).remove();
            },
            ready: function () {
                captcha.render($('.captcha', sandbox), {
                    success: function () {
                        $('.accounts-signup .signup', sandbox).removeAttr('disabled');
                    }
                }, function (err, id) {
                    if (err) {
                        return console.error(err);
                    }
                    captchaId = id;
                });
            }
        });
    });
};

var user;
/*

 setTimeout(function () {
 var serand = require('serand');
 serand.emit('user', 'login', { username: 'ruchira'});
 }, 4000);*/
