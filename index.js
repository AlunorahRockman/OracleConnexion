import express from 'express';
import oracledb from 'oracledb';
import cors from 'cors'

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

const app = express();

app.use(cors({
    origin:'*'
}))

const port = 5000;

app.use(express.json());

app.get('/getAllEtudiant', async (req, res) => {
    let con;
    try {
        con = await getConnection();
        const data = await con.execute('SELECT * FROM VETUDIANT');
        res.json(data.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Une erreur est survenue lors de la récupération des étudiants.' });
    } finally {
        if (con) {
            try {
                await con.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
});

app.get('/getAllHistorique', async (req, res) => {
    let con;
    try {
        con = await getConnection();
        const data = await con.execute('SELECT * FROM HISTORIQUEETUDIANT');
        res.json(data.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Une erreur est survenue lors de la récupération de l\'historique.' });
    } finally {
        if (con) {
            try {
            await con.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
});

app.get('/getOneEtudiant/:id', async (req, res) => {
    const id = req.params.id;
    let con;
    try {
        con = await getConnection();
        const result = await con.execute('SELECT * FROM ETUDIANT WHERE ID = :id', [id]);
        if (result.rows.length === 0) {
            res.status(404).json({ error: 'Étudiant introuvable.' });
        } else {
            res.json(result.rows[0]);
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Une erreur est survenue lors de la récupération de l\'étudiant.' });
    } finally {
        if (con) {
            try {
                await con.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
});


app.post('/createEtudiant', async (req, res) => {
    const newStudent = req.body;
    let con;
    try {
        con = await getConnection();
        const result = await con.execute(
            `INSERT INTO ETUDIANT (ID, NOM, PRENOM, AGE, ADRESSE, SEXE, PAYS, NUMERO)
            VALUES (MA_SEQUENCE .NEXTVAL, :nom, :prenom, :age, :adresse, :sexe, :pays, :numero)`,
            newStudent
        );
        await con.commit();
        res.json({ message: 'Étudiant créé avec succès.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: `${err}` });
    } finally {
        if (con) {
            try {
                await con.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
});

app.put('/updateEtudiant/:id', async (req, res) => {
    const updatedStudent = req.body;
    updatedStudent.id = req.params.id;
    let con;
    try {
        con = await getConnection();
        const result = await con.execute(
            `UPDATE ETUDIANT SET NOM = :nom, PRENOM = :prenom, AGE = :age,
            ADRESSE = :adresse, SEXE = :sexe, PAYS = :pays, NUMERO = :numero
            WHERE ID = :id`,
            updatedStudent
        );
        await con.commit();
        res.json({ message: 'Étudiant mis à jour avec succès.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: `${err}` });
    } finally {
        if (con) {
            try {
                await con.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
});

app.delete('/deleteEtudiant/:id', async (req, res) => {
    const id = req.params.id;
    let con;
    try {
        con = await getConnection();
        const result = await con.execute(
            `DELETE FROM ETUDIANT WHERE ID = :id`,
            [id]
        );
        await con.commit();
        res.json({ message: 'Étudiant supprimé avec succès.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Une erreur est survenue lors de la suppression de l\'étudiant.' });
    } finally {
        if (con) {
            try {
                await con.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
});

async function getConnection() {
    return oracledb.getConnection({
        user: 'rindra',
        password: 'rindra',
        connectString: 'localhost:1521/orcl'
    });
}

app.listen(port, () => {
    console.log(`Serveur en cours d'exécution sur le port ${port}`);
});
