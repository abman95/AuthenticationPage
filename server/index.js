const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./db');
const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await db.verifyUser(email, password);
        res.json(user);
    } catch (error) {
        res.status(401).send({ error: error.message });
    }
});

app.post('/newUser', async (req, res) => {
    try {
        await db.addUser(req.body.name, req.body.email, req.body.phonenumber, req.body.password);
        res.status(201).send({ message: 'Benutzer erfolgreich angelegt.' });
    } catch (error) {
        if (error.message === 'Ein Nutzer mit dieser E-Mail ist bereits registriert.') {
            res.status(409).send({ message: error.message }); // 409 Conflict
        } else {
            res.status(500).send({ message: 'Interner Serverfehler.' });
        }
    }
});





// app.patch('/frage/:id', async (req, res) => {
//     try {
//         await db.updateFrageAntwort(req.params.id, req.body.frage, req.body.antwort);
//         res.status(200).send({ message: "Erfolgreich aktualisiert" });
//     } catch (err) {
//         res.status(500).send({ message: "Ein Fehler ist aufgetreten" });
//     }
// });

app.delete('/User/:id', async (req, res) => {
    try {
        await db.deleteUser(req.params.id);
        res.status(200).send({ message: "Dein Profil wurde erfolgreich gelöscht" });
    } catch (err) {
        res.status(500).send({ message: "Ein Fehler ist aufgetreten" });
    }
});






app.listen(port, () => {
    console.log(`Server läuft auf http://localhost:${port}`);
});
