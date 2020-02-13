require('dotenv').config()

module.exports = {
    'connection': {
        'host': process.env.connectionHost,
        'user': process.env.connectionUser,
        'password': process.env.connectionPassword
    },
	'database': process.env.connectionDatabase,
    'users_table': process.env.connectionUsers_table
};

