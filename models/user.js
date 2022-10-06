module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("user", {
        nama: {
            type: Sequelize.STRING
        },
        email: {
            type: Sequelize.STRING
        },
        username: {
            type: Sequelize.STRING
        },
        password: {
            type: Sequelize.STRING
        }
        
        // ,
        // created: {
        //     type: Sequelize.DATE

        // }
    });

    return User;
};