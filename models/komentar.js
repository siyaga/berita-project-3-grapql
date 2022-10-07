module.exports = (sequelize, Sequelize) => {
    const Komentar = sequelize.define("komentar", {
        idberita: {
            type: Sequelize.INTEGER
        },
        username: {
            type: Sequelize.STRING
        },
        komentar: {
            type: Sequelize.TEXT
        }
        // ,
        // created: {
        //     type: Sequelize.DATE

        // }
    });
    return Komentar;
};