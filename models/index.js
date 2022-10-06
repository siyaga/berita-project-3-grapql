const { Sequelize, DataTypes, Model } = require('sequelize');
//  driver sqlite
// const sequelize = new Sequelize('sqlite::memory:');

// sql server
const sequelize = new Sequelize('graphqlBerita', 'test', '123456', {
    dialect: 'mssql',
    dialectOptions: {
      // Observe the need for this nested `options` field for MSSQL
      options: {
        // Your tedious options here
        useUTC: false,
        dateFirst: 1,
      },
    },
  });
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
// tabelnya
db.beritas = require('./berita')(sequelize, Sequelize);
db.komentars = require('./komentar')(sequelize, Sequelize);
db.users = require('./user')(sequelize, Sequelize);

db.beritas.hasMany(db.komentars, {as: "komentars"});
db.komentars.belongsTo(db.beritas,{foreignKey:'idberita'});



module.exports = db;