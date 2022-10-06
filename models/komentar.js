module.exports = (sequelize, Sequelize) => {
    const Komentar = sequelize.define("komentar", {
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