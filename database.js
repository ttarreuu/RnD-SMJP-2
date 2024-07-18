import SQLite from 'react-native-sqlite-storage';

SQLite.DEBUG(true);
SQLite.enablePromise(true);

const database_name = 'MenuData.db';
const database_version = '1.0';
const database_displayname = 'Menu Data';
const database_size = 200000;

let db;

export const initDatabase = async () => {
  try {
    db = await SQLite.openDatabase(
      database_name,
      database_version,
      database_displayname,
      database_size
    );
    await db.executeSql(
      `CREATE TABLE IF NOT EXISTS Menu (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        menuID INTEGER,
        name TEXT, 
        pic TEXT
      );`
    );
  } catch (error) {
    console.log('Error initializing database', error);
  }
};

export const insertLocalDB = async (data) => {
  const { menuID, name, pic } = data;
  try {
    await db.executeSql(
      `INSERT INTO Menu (menuID, name, pic) VALUES (?, ?, ?);`,
      [menuID, name, pic]
    );
  } catch (error) {
    console.log('Error inserting data', error);
  }
};

export const getLocalDB = async () => {
  try {
    let results = await db.executeSql(`SELECT * FROM Menu;`);
    let currData = [];
    results[0].rows.raw().forEach((row) => {
      currData.push(row);
    });
    return currData;
  } catch (error) {
    console.log('Error fetching data', error);
    return [];
  }
};

export const deleteLocalDB = async (id) => {
  try {
    await db.executeSql(`DELETE FROM Menu WHERE id = ?;`, [id]);
  } catch (error) {
    console.log('Error deleting data', error);
  }
};