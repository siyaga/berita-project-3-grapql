const fs = require('fs');

let key= fs.readFileSync('C:/Users/ASUS/Documents/bootcamprapid/finalproject/berita-project-3-grapql/carts/key.pem');
let pubkey = fs.readFileSync('C:/Users/ASUS/Documents/bootcamprapid/finalproject/berita-project-3-grapql/carts/key.pem');

module.exports = {
    secret:key,
    pubkey: pubkey
}