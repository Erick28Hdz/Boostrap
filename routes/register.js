const express = require('express');
const fs = require('fs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const router = express.Router();

const SECRET_KEY = 'clave_secreta_jwt'; // Cambia esto en producción

router.post('/register', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: 'Correo y contraseña son requeridos' });

  fs.readFile('./data/users.json', 'utf8', async (err, data) => {
    if (err) return res.status(500).json({ message: 'Error leyendo la base de datos' });

    const users = JSON.parse(data);

    const existingUser = users.find(u => u.email === email);
    if (existingUser)
      return res.status(400).json({ message: 'Este correo ya está registrado' });

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = { email, password: hashedPassword };

      users.push(newUser);

      fs.writeFile('./data/users.json', JSON.stringify(users, null, 2), err => {
        if (err) return res.status(500).json({ message: 'Error guardando usuario' });

        const token = jwt.sign({ email: newUser.email }, SECRET_KEY, { expiresIn: '1h' });
        res.status(201).json({ message: 'Usuario registrado con éxito', token });
      });
    } catch (e) {
      res.status(500).json({ message: 'Error al procesar el registro' });
    }
  });
});

module.exports = router;
