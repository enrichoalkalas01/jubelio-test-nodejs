import pgPromise from 'pg-promise';

const database_url = process.env.BASE_URL_DB || 'postgres://postgres:1sampai10!@localhost:5432/jubelio-test';

// const pgp = pgPromise();
// const db = pgp({
//     host: 'localhost',
//     port: 5432,
//     database: 'jubelio-test',
//     user: 'postgres',
//     password: '1sampai10!'
// });

const pgp = pgPromise();
const db = pgp(`${ database_url }`);

export default db;
