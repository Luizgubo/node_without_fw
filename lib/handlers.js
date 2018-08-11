/*

REQUEST HANDLERS

*/
const _data = require('./data');
const helpers = require('./helpers');

let handlers = {};




handlers.ping = (data, callback) => {

    callback(200)

}

handlers.notFound = (data, callback) => {

    callback(404)

}

handlers.users = (data, callback) => {

    const acceptableMethods = ['post', 'get', 'put', 'delete']
    
    if(acceptableMethods.indexOf(data.method > -1)) {

        handlers._users[data.method](data, callback);
    
    } else {
        callback(405)
    }
}


handlers._users = {}

handlers._users.post = (data, callback) => {

    let firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
    let lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
    let phoneNumber = typeof(data.payload.phoneNumber) == 'string' && data.payload.phoneNumber.trim().length == 10 ? data.payload.phoneNumber.trim() : false;
    let password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 5 ? data.payload.password.trim() : false;
    let tosAgreement = typeof(data.payload.tosAgreement) == 'boolean' && data.payload.tosAgreement == true ? true : false;


    if(firstName  && lastName && phoneNumber && password && tosAgreement) {

        _data.read('users', phoneNumber, (err, data) => {

            if(!err) {

                // hash the password

                let hashedPassword = helpers.hash(password);

                if(hashedPassword) {
                    
                    let userObject = {
                        'firstName': firstName,
                        'lastName' : lastName,
                        'phoneNumber' : phoneNumber,
                        'hashedPassword':hashedPassword,
                        'tosAgreement': true
                    };
    
                    _data.create('users', phoneNumber, userObject, (err) => {
                        if(!err) {
                            callback(200);
                        } else {
                            console.log(err);
                            callback(500, {"Error":"Couldn't create the new user"})
                        }
                    });
                } else {
                    callback(500, {"Error":"Could not hash the user's password"});
                }

            } else {
                callback(400, {'Error': 'A user with that phone number already exists'})
            }
        });

    } else {

        callback(400, {'Error' : 'Missing required Fields'});
    }
}

handlers._users.get = (data, callback) => {
    
}
handlers._users.put = (data, callback) => {
    
}
handlers._users.delete = (data, callback) => {
    
}

module.exports = handlers