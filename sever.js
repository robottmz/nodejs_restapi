const express = require('express');
const {Client} = require('pg')

const app = express();
app.use(express.json());

//pg connection
const client = new Client({
    host: "internet.nectec.or.th",
    user: "student",
    port: 5432,
    password: "std@1234",
    database: "iiradminverifydb"
})

client.connect();

/*client.query("Select * from tbl_user_account",(err,res)=>{
    if(!err){
        console.log(res.row);
    }else{
        console.log('Error conecting to database = ', err.message);;
    }
    client.end;
})*/

// CREATE Routes
app.post("/create", async (req, res) => {
    const { email, name, password } = req.body;

    try {
        connection.query(
            "INSERT INTO users(email, fullname, password) VALUES(?, ?, ?)",
            [email, name, password],
            (err, results, fields) => {
                if (err) {
                    console.log("Error while inserting a user into the database", err);
                    return res.status(400).send();
                }
                return res.status(201).json({ message: "New user successfully created!"});
            }
        )
    } catch(err) {
        console.log(err);
        return res.status(500).send();
    }
})

// READ
app.get("/read", async (req, res) => {
    try {
        connection.query("SELECT * FROM users", (err, results, fields) => {
            if (err) {
                console.log(err);
                return res.status(400).send();
            }
            res.status(200).json(results)
        })
    } catch(err) {
        console.log(err);
        return res.status(500).send();
    }
})

// READ single users from db
app.get("/read/single/:email", async (req, res) => {
    const email = req.params.email;

    try {
        connection.query("SELECT * FROM users WHERE email = ?", [email], (err, results, fields) => {
            if (err) {
                console.log(err);
                return res.status(400).send();
            }
            res.status(200).json(results)
        })
    } catch(err) {
        console.log(err);
        return res.status(500).send();
    }
})

// UPDATE data
app.patch("/update/:email", async (req, res) => {
    const email = req.params.email;
    const newPassword = req.body.newPassword;

    try {
        connection.query("UPDATE users SET password = ? WHERE email = ?", [newPassword, email], (err, results, fields) => {
            if (err) {
                console.log(err);
                return res.status(400).send();
            }
            res.status(200).json({ message: "User password updated successfully!"});
        })
    } catch(err) {
        console.log(err);
        return res.status(500).send();
    }
})

// DELETE
app.delete("/delete/:email", async (req, res) => {
    const email = req.params.email;

    try {
        connection.query("DELETE FROM users WHERE email = ?", [email], (err, results, fields) => {
            if (err) {
                console.log(err);
                return res.status(400).send();
            }
            if (results.affectedRows === 0) {
                return res.status(404).json({ message: "No user with that email!"});
            }
            return res.status(200).json({ message: "User deleted successfully!"});
        })
    } catch(err) {
        console.log(err);
        return res.status(500).send();
    }
})