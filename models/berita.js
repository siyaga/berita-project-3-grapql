module.exports = (sequelize, Sequelize) => {
    const Berita = sequelize.define("berita", {
        judul: {
            type: Sequelize.TEXT
        },
        author: {
            type: Sequelize.STRING
        },
        image: {
            type: Sequelize.STRING
        },
        artikel: {
            type: Sequelize.TEXT
        }
    }, {
        
        paranoid:true,
        deleteAt: 'destroyTime'
    });
    return Berita;
};