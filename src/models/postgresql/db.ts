import pgPromise from 'pg-promise';

const pgp = pgPromise();
const db = pgp({
    host: 'localhost',
    port: 5432,
    database: 'jubelio-test',
    user: 'postgres',
    password: 'ALKAkosat123!'
});

export default db;