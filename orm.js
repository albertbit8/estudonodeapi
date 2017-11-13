module.exports = function(server){

    var Sequelize = require('sequelize');

    var sequelize = new Sequelize('mdmachhn_market', 'mdmachhn_bitx', 'Ec0n0b1t420', {
        host: '162.215.253.9',
        dialect: 'mysql',

        pool: {
            max: 5,
            min: 0,
            idle: 10000
        }
    });


    var Cliente = sequelize.define('Cliente', {
        id: {
                type: Sequelize.INTEGER(11),
                autoIncrement: true,
                primaryKey: true
            },
        username: Sequelize.STRING(255),
        password: Sequelize.STRING(255),
        secret_pin: Sequelize.STRING(255),
        email: Sequelize.STRING(255),
        email_verified: Sequelize.INTEGER(11),
        email_hash: Sequelize.TEXT,
        document_verified: Sequelize.INTEGER(11),
        document_1: Sequelize.TEXT,
        document_2: Sequelize.TEXT,
        mobile_verified: Sequelize.INTEGER(11),
        mobile_number: Sequelize.TEXT,
        status: Sequelize.STRING(255),
        hash: Sequelize.STRING(255),
        ip: Sequelize.STRING(255),
        time_signup: Sequelize.INTEGER(11),
        time_signin: Sequelize.INTEGER(11),
        time_activity: Sequelize.INTEGER(11),
        referral_id: Sequelize.INTEGER(11)
    });

}