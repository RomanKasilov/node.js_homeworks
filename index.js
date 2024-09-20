const express = require('express');
const {read, write} = require('./fs.service');

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));


app.get('/users', async (req, res) => {
    try {
        const users = await read()
        res.send(users)
    } catch (e) {
        res.status(500).send(e.message);
    }
})

app.post('/users', async (req, res) => {
    try {
        const {name, email, password, repassword} = req.body;

        if (!name || name.length < 3) {
            return res.status(400).send('Name is required and should be at least 3 characters long');
        }
        if (!email || email.search(/^(\w{3,16})(@gmail\.com)$/gm) !== 0) {
            return res.status(400).send('для сервисов gmail.com длина имени до 16 символов ')
        }
        if (!password || password !== repassword) {
            return res.status(400).send(' поля password и repassword не совпадают')
        }

        const users = await read();
        const id = users.length ? users[users.length - 1]?.id + 1 : 1;
        const newUser = {id, name, email, password};
        users.push(newUser);
        await write(users);
        res.status(201).send(newUser);
    } catch (e) {
        res.status(500).send(e.message);
    }
})

app.get('/users/:id', async (req, res) => {
    const id = +req.params.id;
    try {
        const users = await read()
        const user = users.find(user => user.id === id)
        if (!user) {
            res.status(404).send('Not found')
        }
        res.send(user);
    } catch (e) {
        res.status(500).send(e.message);
    }
})

app.put('/users/:id', async (req, res) => {
    try {
        const {name, email, password, repassword} = req.body;
        const id = Number(req.params.id)

        if (!name || name.length < 3) {
            return res.status(400).send('Name is required and should be at least 3 characters long');
        }
        if (!email || email.search(/^(\w{3,16})(@gmail\.com)$/gm) !== 0) {
            return res.status(400).send('для сервисов gmail.com длина имени до 16 символов ')
        }
        if (!password || password !== repassword) {
            return res.status(400).send(' поля password и repassword не совпадают')
        }

        const users = await read()

        const userIndex = users.findIndex(user => user.id === id)
        if (userIndex === -1) {
            res.status(404).send('User not found')
        }

        users[userIndex] = {...users[userIndex], name, email, password}
        await write(users)
        res.status(201).send('Success')
    } catch (e) {
        res.status(500).send(e.message);
    }
})

app.patch('/users/:id', async (req, res) => {
    try {
        const id = +req.params.id;
        const {name, email, password, repassword} = req.body;
        if (name && name.length < 3) {
            return res.status(400).send('Name is required and should be at least 3 characters long');
        }
        if (email && email.search(/^(\w{3,16})(@gmail\.com)$/gm) !== 0) {
            return res.status(400).send('для сервисов gmail.com длина имени до 16 символов ')
        }
        if (password && password !== repassword) {
            return res.status(400).send(' поля password и repassword не совпадают')
        }
        const users = await read()
        const userIndex = users.findIndex(user => user.id === id)
        if (userIndex === -1) {
            res.status(404).send('User not found')
        }
        if (name) {
            users[userIndex].name = name
        }
        if (email) {
            users[userIndex].email = email
        }
        if (password) {
            users[userIndex].password = password
        }
        await write(users)
        res.status(201).send(users[userIndex]);
    } catch (e) {
        res.status(500).send(e.message);
    }
})
app.delete('/users/:id', async (req, res) => {
    try {
        const id = +req.params.id;
        const users = await read()
        const userIndex = users.findIndex(user => user.id === id)
        if (userIndex === -1) {
            res.status(404).send('User not found')
        }
        users.splice(userIndex,1)
        await write(users)
        res.sendStatus(204)
    } catch (e) {
        res.status(500).send(e.message);
    }
})

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000')
})

