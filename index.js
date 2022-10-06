const {
    ApolloServer,
    gql
} = require('apollo-server');
let bcrypt = require('bcrypt');
const db = require('./models');
const jwt = require('jsonwebtoken');
const config = require('./config');

db.sequelize.sync()
    .then(() => {
        console.log("async db");
    })
    .catch((err) => {
        console.log("error: " + err.message);
    });
const Beritas = db.beritas;
const Komentars = db.komentars;
const Users = db.users;
const Op = db.Sequelize.Op;

const resolvers = {
    Query: {
        beritas: () => {
            return Beritas.findAll({
                attributes: ['id', 'judul', 'author','image','artikel','createdAt']
              })
                .then(berita => {
                    return berita;
                })
                .catch(err => {
                    return [];
                });
        },
        users: (parent, args, context) => {
            if (!context.user) throw new AuthenticationError('you must be logged in');
            else
                return Users.findAll()
                    .then(users => {
                        return users;
                    })
                    .catch(err => {
                        return [];
                    });
        },
    },
    Mutation: {
        createBerita: (parent, {
            judul,
            author,
            image,
            artikel
        }) => {
            
            let berita = {
                judul: judul,
                author: author,
                image: image,
                artikel: artikel
            }
            return Beritas.create(berita)
                .then(data => {
                    return data;
                })
                .catch(err => {
                    return {};
                });
        },
        createKomentar: (parent, {
            idberita,
            komentar,
            username,
        }) => {
            
            let komen = {
                idberita: idberita,
                komentar: komentar,
                username: username,
            }
            return Komentars.create(komen)
                .then(data => {
                    return data;
                })
                .catch(err => {
                    return {};
                });
        },
        getBerita: (parent, {
            id
        }) => {
            const idd = id;
            return Beritas.findByPk(idd,{
                attributes: ['id', 'judul', 'author','image','artikel','createdAt']})
                .then(data => {
                    return data;
                })
                .catch(err => {
                    return {};
                });
        },
        updateBerita: (parent, {
            id,
            judul,
            author,
            image,
            artikel
        }) => {
            const berita = {
                judul: judul,
                author: author,
                image: image,
                artikel: artikel
            }
            return Beritas.update(berita, {
                    where: {
                        id: id
                    }
                })
                .then(num => {
                    return {
                        id: id,
                        judul: judul,
                        author: author,
                        image: image,
                        artikel: artikel
                    };
                })
                .catch(err => {
                    return {};
                });
        },
        deleteBerita: (parent, {
            id
        }) => {

            return Beritas.findByPk(id)
                .then(data => {
                    if (data) {
                        return Beritas.destroy({
                                where: {
                                    id: id
                                }
                            })
                            .then(num => {
                                return data;
                            })
                            .catch(err => {
                                return {};
                            });
                    } else {

                    }
                })
                .catch(err => {
                    return {};
                });

        },
        register: (parent, {
            nama,
            email,
            username,
            password
        }) => {
            let passwordHash = bcrypt.hashSync(password, 10);
            let user = {
                nama: nama,
                email: email,
                username: username,
                password: passwordHash
            }
            return Users.create(user)
                .then(data => {
                    return data;
                })
                .catch(err => {
                    return {};
                });
        },
        login: (parent, {
            username,
            password
        }) => {
            return Users.findOne({
                    where: {
                        username: username
                    }
                })
                .then(data => {
                    if (data) {
                        var loginValid = bcrypt.compareSync(password, data.password);

                        if (loginValid) {
                            // JWT Authentication
                            let payload = {
                                userid: data.id,
                                username: username
                            };

                            let token = jwt.sign(
                                payload,
                                config.secret, {
                                    expiresIn: '12h'
                                }

                            )
                            let dt = new Date();
                            dt.setHours(dt.getHours() + 12);
                            return {
                                success: true,
                                token: token,
                                expired: dt.toLocaleDateString() + ' ' + dt.toLocaleTimeString()
                            };
                        } else {
                            return {};
                        }

                    } else {
                        return {};
                    }
                })
                .catch(err => {
                    console.log(err);
                    return {};
                });
        },

    }
};

const {
    ApolloServerPluginLandingPageLocalDefault
} = require('apollo-server-core');



const fs = require('fs');
const path = require('path');
const typeDefs = fs.readFileSync("./schema.graphql", "utf-8").toString();

const server = new ApolloServer({
    typeDefs,
    resolvers,
    csrfPrevention: true,
    cache: 'bounded',
    context: ({
        req
    }) => {

        const token = req.headers.authorization || '';
        if (token) {
            // extract
            let payload = jwt.verify(token, config.pubkey)
            Users.findByPk(payload.userid)
                .then(data => {
                    if (data) {
                        return {
                            data
                        };
                    } else {
                        // htttp 404 not found
                        return {};
                    }
                })
                // error
                .catch(err => {
                    return {};
                })
        }

    },
    plugins: [
        ApolloServerPluginLandingPageLocalDefault({
            embed: true
        }),
    ],
});

server.listen().then(({
    url
}) => {
    console.log(`🚀  Server ready at ${url}`);
});