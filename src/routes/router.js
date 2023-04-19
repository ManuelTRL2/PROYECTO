const express = require('express');
const router = express.Router();

// Ruta para mostrar el formulario de inicio de sesión
router.get('/', (req, res) => {
  res.render('index'); // renderiza el archivo HTML
});

router.get('/login', (req, res) => {
  res.render('login'); // renderiza el archivo HTML
});


module.exports = router;
