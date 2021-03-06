const Action = require('idylle').Action;
const uuid = require('uuid').v4;

module.exports = app => {

    return Action({
        rules: [
            context => (context.data.realm && context.data.port) || context.error(400, 'missing.data')
        ],
        execute: (context) => {
            const Instance = app.models.Instance;
            const address = context.data.address || context.socket.handshake.address;
            const port = context.data.port;
            const uid = context.socket.id;
            const secure = context.data.secure;
            const token = uuid();

            console.log('> Instance ', address, 'for', context.data.realm, 'successfully subscribed.');

            return updateOrCreateInstance()
                .then(() => token);

            function updateOrCreateInstance() {
                return Instance
                    .update(
                        { address, port },
                        {
                            uid, address, port, secure,
                            realm: context.data.realm,
                            timeout: context.data.timeout || app.settings.dispatch_timeout,
                            access_token: token,
                        },
                        {
                            upsert: true
                        });
            }
        }
    });
}
