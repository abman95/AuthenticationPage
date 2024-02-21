const bcrypt = require('bcrypt');
const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: ''
});

connection.query("CREATE DATABASE IF NOT EXISTS UserManagement", function (err) {
    if (err) throw err;
    connection.changeUser({database: 'UserManagement'}, function(err) {
        if (err) throw err;
        
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS Users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                phonenumber VARCHAR(20) NOT NULL,
                passwordHash VARCHAR(255) NOT NULL,
                create_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`;
        connection.query(createTableQuery, function (err) {
            if (err) throw err;
            console.log("Tabelle Users wurde erstellt oder existiert bereits.");
        });
    });
});

function addUser(name, email, phonenumber, password) {
    return getUser(email)
    .then(user => {
        throw new Error('Ein Nutzer mit dieser E-Mail ist bereits registriert.');
    })
    .catch(err => {
        if (err.message === 'User not found') {
            return bcrypt.hash(password, 10)
            .then(passwordHash => {
                return new Promise((resolve, reject) => {
                    const query = "INSERT INTO Users (name, email, phonenumber, passwordHash) VALUES (?, ?, ?, ?)";
                    connection.query(query, [name, email, phonenumber, passwordHash], (err, result) => {
                        if (err) reject(err);
                        resolve('Neuer Nutzer wurde erfolgreich hinzugefügt.');
                    });
                });
            });
        } else {
            return Promise.reject(err);
        }
    });
}

function getUser(email) {
    return new Promise((resolve, reject) => {
        const query = "SELECT id, name, email, phonenumber, passwordHash FROM Users WHERE email = ?";
        connection.query(query, [email], (err, results) => {
            if (err) {
                reject(err);
            } else if (results.length > 0) {
                resolve(results[0]);
            } else {
                reject(new Error('User not found'));
            }
        });
    });
}

function verifyUser(email, password) {
    return getUser(email)
    .then(user => {
        return bcrypt.compare(password, user.passwordHash)
        .then(isMatch => {
            if (!isMatch) {
                throw new Error('Password does not match');
            }
            return user;
        });
    });
}

function deleteUser(id) {
    return new Promise((resolve, reject) => {
        const query = "DELETE FROM Users WHERE id = ?";
        connection.query(query, [id], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}    


    // function updateFrageAntwort(id, neueFrage, neueAntwort) {
    //     return new Promise((resolve, reject) => {
    //         const query = "UPDATE FrageAntwort SET frage = ?, antwort = ? WHERE id = ?";
    //         connection.query(query, [neueFrage, neueAntwort, id], (err, result) => {
    //             if (err) {
    //                 reject(err);
    //             } else {
    //                 resolve(result);
    //             }
    //         });
    //     });
    // }



    module.exports = { addUser, getUser, verifyUser, deleteUser };

