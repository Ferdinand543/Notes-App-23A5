const express = require('express')
const mysql = require('mysql2')
const cors = require('cors')
require('dotenv').config()

const app = express()

app.use(cors())
app.use(express.json())

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})

db.connect((err) => {
    if (err) {
        console.log('Database Error:', err)
    } else {
        console.log('MySQL Connected')
    }
})

/* =========================
   GET NOTES
========================= */
app.get('/api/notes', (req, res) => {

    db.query(
        'SELECT * FROM notes ORDER BY id DESC',
        (err, result) => {

            if (err) {
                console.log(err)
                return res.status(500).send(err)
            }

            res.json(result)
        }
    )

})

/* =========================
   ADD NOTE
========================= */
app.post('/api/notes', (req, res) => {

    const { title, content } = req.body

    if (!title || !content) {
        return res.status(400).json({
            message: 'Title dan content wajib diisi'
        })
    }

    db.query(
        'INSERT INTO notes(title, content) VALUES (?, ?)',
        [title, content],
        (err, result) => {

            if (err) {
                console.log(err)
                return res.status(500).send(err)
            }

            res.json({
                message: 'Note berhasil ditambahkan',
                result
            })

        }
    )

})

app.put('/api/notes/:id', (req, res) => {

    const { title, content } = req.body

    db.query(
        'UPDATE notes SET title=?, content=? WHERE id=?',
        [title, content, req.params.id],
        (err, result) => {

            if (err) {
                console.log(err)
                return res.status(500).send(err)
            }

            res.json({
                message: 'Note berhasil diupdate'
            })

        }
    )

})

/* =========================
   DELETE NOTE
========================= */
app.delete('/api/notes/:id', (req, res) => {

    db.query(
        'DELETE FROM notes WHERE id=?',
        [req.params.id],
        (err, result) => {

            if (err) {
                console.log(err)
                return res.status(500).send(err)
            }

            res.json({
                message: 'Note berhasil dihapus'
            })

        }
    )

})

/* =========================
   SERVER
========================= */
app.listen(process.env.PORT, () => {
    console.log(`Server Running on Port ${process.env.PORT}`)
})