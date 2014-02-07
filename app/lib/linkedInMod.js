var linkedInModule = {};
(function () {
    function auth(callback) {
        adapter.loadAccessToken('linkedin');
        if (adapter.isAuthorized() === false) {
            function postAuthorize() {
                adapter.getAccessToken('https://api.linkedin.com/uas/oauth/accessToken');
                adapter.saveAccessToken('linkedin');
                callback();
            };

            function showAuthorize(token){
                adapter.showAuthorizeUI('https://api.linkedin.com/uas/oauth/authorize?oauth_token=' + token, postAuthorize);
            };

            adapter.getRequestToken('https://api.linkedin.com/uas/oauth/requestToken?scope=r_fullprofile', showAuthorize);

        } else callback && callback();
    }

    function sendRequest(a, b) {
        var xhr = Ti.Network.createHTTPClient();
                
        xhr.onload = function (a) {
            b && b(xhr.responseText)
        };

        xhr.onerror = function (a) {
            Ti.API.error(JSON.stringify(a)), b && b(xhr.responseText)
        }

        Ti.API.info('signed_url=' + a.signed_url);
        Ti.API.info('header=' + a.header);
        
        xhr.open('GET', a.signed_url);
        xhr.setRequestHeader('Authorization', a.header);
        xhr.setRequestHeader('Content-Type', 'text/plain;charset=UTF-8');
        xhr.setRequestHeader('x-li-format', 'json');
        xhr.send();
    }

    var adapter,
        apiKey,
        secretKey
        e = 'http://api.linkedin.com/v1/';
    Ti.include('lib/oauth_adapter.js'),
    Ti.include('lib/OAuthSimple.js'),
    linkedInModule.init = function (s, a) {
        adapter = new OAuthAdapter(s, a, 'HMAC-SHA1'),
        secretKey = s,
        apiKey = a;
    }, 
    linkedInModule.authorize = function (a) {
        auth(a);
    },
    linkedInModule.getUser = function (callback) {
        linkedInModule.authorize(function () {
            var e = adapter.loadAccessToken('linkedin');
            sendRequest(OAuthSimple().sign({
                path: 'http://api.linkedin.com/v1/people/~:(first-name,last-name,headline,positions:(company))',
                action: 'GET',
                signatures: {
                    consumer_key: apiKey,
                    shared_secret: secretKey,
                    access_token: e.accessToken,
                    access_secret: e.accessTokenSecret
                }
            }), callback);
        });
    };
})();

module.exports = linkedInModule;