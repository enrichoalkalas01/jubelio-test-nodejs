import pgPromise from 'pg-promise';
import db from './db'; // Import koneksi database
import fs from 'fs';
import path from 'path';

const args = process.argv.slice(2);

const runMigrations = async () => {
    try {
        const existTables = await db.any(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'; 
        `);

        // Run Migrations For All Files
        if ( args.find(arg => arg?.startsWith('--all')) ) {
            const migrationFiles = fs.readdirSync(path.join(__dirname, '../migrations'));
            for (const file of migrationFiles ) {
                const migration = require(path.join(__dirname, '../migrations', file));
                
                if ( existTables?.length > 0) {
                    for ( const i in existTables ) {
                        if ( migration?.table_name !== existTables[i]?.table_name ) {
                            await migration.up(db);
                            console.log(`Migration ${file} applied successfully.`);
                        }
                    }
                } else {
                    await migration.up(db);
                    console.log(`Migration ${file} applied successfully.`);
                }
            }

            console.log('===== Migration applied successfully =====');
        }

        // Run Migrations For Specific Name
        else if ( args.find(arg => arg?.startsWith('--name=')) ) {
            const syntaxNameValue:string | undefined = args.find(arg => arg?.startsWith('--name='))?.split('=')[1];
            const migrationFiles = fs.readdirSync(path.join(__dirname, '../migrations'));

            if ( migrationFiles?.includes(`${ syntaxNameValue }`) ) {
                const migration = require(path.join(__dirname, '../migrations', `${ syntaxNameValue }`));
                
                if ( migration ) {
                    if ( existTables?.length > 0 ) {
                        for ( const i in existTables ) {
                            if ( migration?.table_name !== existTables[i]?.table_name ) {
                                await migration.up(db);
                            }
                        }
                    } else {
                        await migration.up(db);
                    }
                }

                console.log(`===== Migration ${ syntaxNameValue } applied successfully =====`);
            }
        }

        // Run Migrations Rollback For Specific Name
        else if ( args.find(arg => arg?.startsWith('--rollback-name=')) ) {
            const syntaxNameValue:string | undefined = args.find(arg => arg?.startsWith('--rollback-name='))?.split('=')[1];
            const migrationFiles = fs.readdirSync(path.join(__dirname, '../migrations'));

            if ( migrationFiles?.includes(`${ syntaxNameValue }`) ) {
                const migration = require(path.join(__dirname, '../migrations', `${ syntaxNameValue }`));

                if ( migration ) {
                    if ( existTables?.length > 0 ) {
                        for ( const i in existTables ) {
                            if ( migration?.table_name === existTables[i]?.table_name ) {
                                await migration.down(db);
                            }
                        }
                    } else {
                        await migration.down(db);
                    }
                }
                
                console.log(`===== Migration rollback ${ syntaxNameValue } applied successfully =====`);
            }
        }
        
        // Run Migrations Rollback For All Files
        else if ( args.find(arg => arg?.startsWith('--rollback-all')) ) {
            const migrationFiles = fs.readdirSync(path.join(__dirname, '../migrations'));
            for (const file of migrationFiles ) {
                const migration = require(path.join(__dirname, '../migrations', file));
                await migration.down(db);
                console.log(`Migration ${file} rollback applied successfully.`);
            }

            console.log('===== Migration rollback applied successfully =====');
        }
    } catch (error: any) {
        // Rollback If Failed
        // console.error(error)
        console.error('===== Migration failed =====', error?.message);
    } finally {
        pgPromise().end(); // Close connection
    }
};

const rollbackMigration = async (migrationName?: string) => {
    try {
        if ( migrationName ) {
            const migration = require(path.join(__dirname, '../migrations', migrationName));
            await migration.down(db);
            console.log(`Migration ${migrationName} rollback applied successfully.`);
        }
    } catch (error: any) {
        console.error('Rollback failed', error?.message);
    }
};

runMigrations();