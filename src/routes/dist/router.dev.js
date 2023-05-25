"use strict";

var express = require('express');

var router = express.Router();

var authController = require("../controller/authcontroller");

var conexion = require("../database/db");

var upload = require('../public/js/multer');

var sharp = require('sharp');

var fs = require('fs'); // Ruta para mostrar el formulario de inicio de sesión


router.get('/', authController.isNotAuthenticated, function (req, res) {
  res.render('index', {
    alert: false
  }); // renderiza el archivo HTML
});
router.get('/login', authController.isNotAuthenticated, function (req, res) {
  res.render('login', {
    alert: false
  }); // renderiza el archivo HTML
});
router.get("/ticket", authController.isAuthenticated, function (req, res) {
  if (req.user.tipo === 'Administrador') {
    res.redirect('/pagos');
  } else {
    var user = req.user.id;
    conexion.query( // UNIR INFORMACION DE TABLAS
    "SELECT * FROM usuarios u LEFT JOIN informacion i ON u.usuario_informacion=i.id where u.id = ?", [user], function (error, results) {
      if (error) {} else {
        res.render("ticket", {
          results: results,
          ticket: results[0],
          user: req.user
        });
      }
    });
    ;
  }
});
router.get("/ticket-search", authController.isAuthenticated, function (req, res) {
  var user = req.user.id;
  conexion.query('SELECT id, clave, concepto, uma, costo FROM tramites WHERE concepto LIKE "%' + req.query.term + '%" && identificador="fierros"', function (err, rows, result) {
    if (err) throw err;
    var data = [];

    for (i = 0; i < rows.length; i++) {
      data.push({
        label: rows[i].concepto,
        value: {
          id: rows[i].id,
          clave: rows[i].clave,
          concepto: rows[i].concepto,
          uma: rows[i].uma,
          costo: rows[i].costo
        }
      });
    } // CONVERTIR JSON A STRING


    res.end(JSON.stringify(data));
  });
});
router.get("/search-contribuyente", function (req, res) {
  var searchTerm = req.query.term;
  var query = "SELECT c.id_contribuyente, c.nombre, c.apellido_paterno, c.apellido_materno, c.clave_ine, c.domicilio_parcelario, c.estado, c.fecha_inscripcion, \n  IFNULL(t.id_tramites, t_last.id_tramites) AS id_tramites, (t.fecha) AS fecha\nFROM contribuyente c\nLEFT JOIN (\nSELECT id_contribuyente, MAX(id_ticket) AS max_id_ticket\nFROM ticket\nWHERE id_tramites = 243\nGROUP BY id_contribuyente\n) subq ON c.id_contribuyente = subq.id_contribuyente\nLEFT JOIN ticket t ON subq.max_id_ticket = t.id_ticket\nLEFT JOIN ticket t_last ON c.id_contribuyente = t_last.id_contribuyente AND subq.max_id_ticket IS NULL\nWHERE c.clave_ine LIKE ? OR CONCAT(c.nombre, ' ', c.apellido_paterno, ' ', c.apellido_materno) LIKE ? AND c.estado != 'CANCELADO' ORDER BY c.id_contribuyente";
  var searchTermWithWildcard = "%".concat(searchTerm, "%");
  /* MOSTRARA UNICAMENTE LOS CONTRIBUYENTES CON ESTADO ACTIVO O null */

  conexion.query(query, [searchTermWithWildcard, searchTermWithWildcard], function (err, rows, result) {
    if (err) throw err;
    var data = [];

    for (i = 0; i < rows.length; i++) {
      data.push({
        label: rows[i].clave_ine + "                                              " + rows[i].nombre + " " + rows[i].apellido_paterno + " " + rows[i].apellido_materno,
        value: {
          id_contribuyente: rows[i].id_contribuyente,
          nombre: rows[i].nombre,
          apellido_paterno: rows[i].apellido_paterno,
          apellido_materno: rows[i].apellido_materno,
          clave_ine: rows[i].clave_ine,
          domicilio_parcelario: rows[i].domicilio_parcelario,
          fecha: rows[i].fecha,
          fecha_inscripcion: rows[i].fecha_inscripcion,
          id_tramites: rows[i].id_tramites
        }
      });
    } // CONVERTIR JSON A STRING


    res.end(JSON.stringify(data));
  });
});
router.post("/contribuyente", authController.isAuthenticated, function (req, res) {
  var user = req.user.id;
  var clave_ine = req.body.clave_ine_1;
  var nombre = req.body.nombre1;
  var domicilio_parcelario = req.body.domicilio_parcelario1;
  var apellido_paterno = req.body.apellido_paterno;
  var apellido_materno = req.body.apellido_materno;
  conexion.query("INSERT INTO contribuyente (clave_ine,  nombre, domicilio_parcelario, apellido_paterno, apellido_materno) VALUES \n      (\"".concat(clave_ine, "\",  \"").concat(nombre, "\",\"").concat(domicilio_parcelario, "\",\"").concat(apellido_paterno, "\",\"").concat(apellido_materno, "\")\n      "), [user], function (error, result) {
    if (error) {
      throw error;
    } else {
      res.redirect('/ticket');
    }
  });
});
router.get("/insertar_tramites", authController.isAuthenticated, function (req, res) {
  var user = req.user.id;
  var id_tramites = req.query.id_tramites;
  var cantidad = req.query.cantidad;
  var importe = req.query.importe;
  var id_contribuyente = req.query.id_contribuyente;
  var dt = new Date();
  var year = dt.getFullYear();
  var month = dt.getMonth() + 1;
  var day = dt.getDate();
  var fecha = "".concat(year, "-").concat(month < 10 ? "0" + month : month, "-").concat(day < 10 ? "0" + day : day);
  var folio = req.query.folio;
  var hora = req.query.hora;
  var query = "INSERT INTO ticket (id_contribuyente, id_tramites, id_usuario, cantidad, importe, fecha, hora, folio) VALUES (\"".concat(id_contribuyente, "\", \"").concat(id_tramites, "\",\"").concat(user, "\", \"").concat(cantidad, "\", \"").concat(importe, "\", \"").concat(fecha, "\", \"").concat(hora, "\", \"").concat(folio, "\")");
  conexion.query(query, [user], function (error, result) {
    if (error) return res.send(error);else res.end(JSON.stringify("insertado correctamente"));
  });
});
router.post("/cambiar_folio", authController.isAuthenticated, function (req, res) {
  var user = req.user.usuario_informacion;
  var folio = req.query.folio;
  var query = "UPDATE informacion SET folio = \"".concat(folio, "\" WHERE id = \"").concat(user, "\"");
  conexion.query(query, [user], function (error, result) {
    if (error) return res.send(error);else res.end(JSON.stringify("insertado correctamente;"));
  });
});
router.get('/obtener-datos', authController.isAuthenticated, function (req, res) {
  var user = req.user.usuario_informacion; // Realización de la consulta a la base de datos

  conexion.query("SELECT folio FROM informacion where id = \"".concat(user, "\""), function (err, result) {
    if (err) {
      console.error('Error al obtener los datos de la base de datos: ' + err.stack);
      return res.status(500).send('Error al obtener los datos');
    } // Devolución de los datos como respuesta a la petición AJAX


    var html = result.map(function (dato) {
      return "".concat(dato.folio);
    }).join('');
    res.send(html);
  });
});
router.get('/pagos', authController.isAuthenticated, function (req, res) {
  res.render('pagos', {
    user: req.user
  }); // renderiza el archivo HTML
});
router.get("/obtener-fierros-pagos", authController.isAuthenticated, function (req, res, results) {
  var folio_finanzas = req.query.folio_finanzas;
  var nombre = req.query.nombre;
  var apellido_paterno = req.query.apellido_paterno;
  var apellido_materno = req.query.apellido_materno;
  var concepto = req.query.concepto;
  var fecha_inicio = req.query.fecha_inicio;
  var fecha_fin = req.query.fecha_fin;
  var sql = "SELECT * FROM ticket t LEFT JOIN contribuyente c on t.id_contribuyente = c.id_contribuyente LEFT JOIN tramites r on t.id_tramites = r.id";
  var params = [];

  if (folio_finanzas) {
    sql += ' AND t.folio_finanzas LIKE ?';
    params.push('%' + folio_finanzas + '%');
  }

  if (nombre) {
    sql += ' AND c.nombre LIKE ?';
    params.push('%' + nombre + '%');
  }

  if (apellido_paterno) {
    sql += ' AND c.apellido_paterno LIKE ?';
    params.push('%' + apellido_paterno + '%');
  }

  if (apellido_materno) {
    sql += ' AND c.apellido_materno LIKE ?';
    params.push('%' + apellido_materno + '%');
  }

  if (concepto) {
    sql += ' AND r.concepto LIKE ?';
    params.push('%' + concepto + '%');
  }

  if (fecha_inicio) {
    sql += ' AND t.fecha >= ?';
    params.push(fecha_inicio);
  }

  if (fecha_fin) {
    sql += ' AND t.fecha <= ?';
    params.push(fecha_fin);
  } else {
    sql += ' AND t.fecha <= IFNULL(?, NOW())';
    params.push(null);
  }

  conexion.query(sql, params, function (err, rows, result) {
    if (err) throw err;
    var data = [];

    for (i = 0; i < rows.length; i++) {
      data.push({
        id_ticket: rows[i].id_ticket,
        fecha: rows[i].fecha,
        clave: rows[i].clave,
        nombre: rows[i].nombre,
        apellido_paterno: rows[i].apellido_paterno,
        apellido_materno: rows[i].apellido_materno,
        concepto: rows[i].concepto,
        uma: rows[i].uma,
        cantidad: rows[i].cantidad,
        importe: rows[i].importe,
        clave_ine: rows[i].clave_ine,
        folio_finanzas: rows[i].folio_finanzas,
        folio: rows[i].folio,
        id_contribuyente: rows[i].id_contribuyente,
        id_usuario: rows[i].id_usuario
      });
    } // CONVERTIR JSON A STRING


    res.end(JSON.stringify(data));
  });
});
router.post('/finanzas_update', authController.isAuthenticated, function (req, res) {
  var id = req.query.id;
  var user = req.user.id;
  var folio_finanzas = req.query.folio_finanzas;
  myDate = new Date();
  hours = myDate.getHours();
  minutes = myDate.getMinutes();
  seconds = myDate.getSeconds();
  hora = hours % 12;
  if (hora < 10) hora = "0" + hora;
  if (hora == 0) hora = "12";
  if (minutes < 10) minutes = "0" + minutes;
  if (seconds < 10) seconds = "0" + seconds;
  var hora_finanzas = hora + ":" + minutes + ":" + seconds;
  var dt = new Date();
  var year = dt.getFullYear();
  var month = dt.getMonth() + 1;
  var day = dt.getDate();
  var fecha_finanzas = "".concat(year, "-").concat(month < 10 ? "0" + month : month, "-").concat(day < 10 ? "0" + day : day);
  conexion.query('UPDATE ticket SET ? WHERE id_ticket = ?', [{
    folio_finanzas: folio_finanzas,
    hora_finanzas: hora_finanzas,
    fecha_finanzas: fecha_finanzas
  }, id, user], function (error, results) {
    if (error) {
      console.log(error);
    } else {
      res.redirect('/pagos');
    }
  });
});
router.get('/manifestar', authController.isAuthenticated, function (req, res) {
  if (req.user.tipo === 'Administrador') {
    res.redirect('/pagos');
  } else {
    res.render('manifestar', {
      user: req.user
    }); // renderiza el archivo HTML
  }
});
router.get("/search-manifestar", function (req, res) {
  conexion.query('SELECT c.*, MAX(c.nombre) AS nombre FROM contribuyente c INNER JOIN ticket p ON c.id_contribuyente = p.id_contribuyente WHERE clave_ine LIKE "%' + req.query.term + '%" AND estado IS NULL AND folio_finanzas IS NOT NULL GROUP BY c.id_contribuyente', function (err, rows, result) {
    if (err) throw err;
    var data = [];

    for (i = 0; i < rows.length; i++) {
      data.push({
        label: rows[i].clave_ine,
        value: {
          id_contribuyente: rows[i].id_contribuyente,
          nombre: rows[i].nombre,
          apellido_paterno: rows[i].apellido_paterno,
          apellido_materno: rows[i].apellido_materno,
          clave_ine: rows[i].clave_ine,
          domicilio_parcelario: rows[i].domicilio_parcelario
        }
      });
    } // CONVERTIR JSON A STRING


    res.end(JSON.stringify(data));
  });
});
router.post('/update_manifestar', upload.single('fierro'), authController.isAuthenticated, function (req, res, next) {
  // Obtener los datos del formulario
  var user = req.user.id;
  var nombre = req.body.nombre;
  var apellido_paterno = req.body.apellido_paterno;
  var apellido_materno = req.body.apellido_materno;
  var clave_ine = req.body.clave_ine;
  var domicilio_ine = req.body.domicilio_ine;
  var domicilio_parcelario = req.body.domicilio_parcelario;
  var libro = req.body.libro;
  var foja = req.body.foja;
  var numero_registro = req.body.numero_registro;
  var dt = new Date();
  var year = dt.getFullYear();
  var month = dt.getMonth() + 1;
  var day = dt.getDate();
  var fecha_inscripcion = "".concat(year, "-").concat(month < 10 ? "0" + month : month, "-").concat(day < 10 ? "0" + day : day);
  var tipo = req.body.tipo;
  var notas = req.body.notas;
  var estado = req.body.estado;
  var hora_inscripcion = req.body.hora;
  var iniciales = req.body.iniciales;
  var telefono = req.body.telefono;
  var filename = '';

  if (req.file) {
    // Obtener el nombre del archivo
    filename = req.file.filename; // Redimensionar la imagen y guardarla en el servidor

    sharp(req.file.path).resize(800, null, {
      withoutEnlargement: true
    }).toBuffer().then(function (data) {
      fs.writeFile(req.file.path, data, function (err) {
        if (err) {
          console.error(err);
        }
      });
    })["catch"](function (err) {
      console.error(err);
    });
  } // Construir la consulta SQL


  var query = "UPDATE contribuyente SET " + "nombre = '" + nombre + "', " + "apellido_paterno = '" + apellido_paterno + "', " + "apellido_materno = '" + apellido_materno + "', " + "clave_ine = '" + clave_ine + "', " + "domicilio_ine = '" + domicilio_ine + "', " + "domicilio_parcelario = '" + domicilio_parcelario + "', " + "libro = '" + libro + "', " + "foja = '" + foja + "', " + "numero_registro = '" + numero_registro + "', " + "tipo = '" + tipo + "', " + "estado = '" + estado + "', " + "notas = '" + notas + "', " + "iniciales = '" + iniciales + "', " + "telefono = '" + telefono + "' "; // Agregar el nombre del archivo si se seleccionó una imagen

  if (filename !== '') {
    query += ", fierro = '" + filename + "' ";
  }

  if (req.query.from === 'page1') {
    query += ", fecha_inscripcion = '" + fecha_inscripcion + "', " + "hora_inscripcion = '" + hora_inscripcion + "' ";
  } // Agregar la condición del ID


  query += "WHERE id_contribuyente = " + req.body.id_contribuyente; // Ejecutar la consulta SQL

  conexion.query(query, [user], function (error, results, fields) {
    if (error) throw error;

    if (req.query.from === 'page1') {
      res.redirect('/manifestar');
    } else {
      // Redirigir a una página predeterminada si el valor del parámetro 'from' no es reconocido
      res.redirect('/manifestados');
    }
  });
});
router.get('/manifestados', authController.isAuthenticated, function (req, res) {
  res.render('manifestados', {
    user: req.user
  }); // renderiza el archivo HTML
});
router.get("/obtener-fierros-manifestados", authController.isAuthenticated, function (req, res, results) {
  var nombre = req.query.nombre;
  var apellido_paterno = req.query.apellido_paterno;
  var apellido_materno = req.query.apellido_materno;
  var clave_ine = req.query.clave_ine;
  var fierro = req.query.fierro;
  var fecha_inicio = req.query.fecha_inicio;
  var fecha_fin = req.query.fecha_fin;
  var sql = "SELECT c.*, t.fecha, t.importe, t.cantidad, t.folio, t.folio_finanzas, t.hora_finanzas, tr.concepto, tr.uma, tr.costo\n  FROM contribuyente c\n  LEFT JOIN (SELECT MAX(id_ticket) as id_ticket, id_contribuyente FROM ticket GROUP BY id_contribuyente) AS last_ticket ON last_ticket.id_contribuyente = c.id_contribuyente\n  LEFT JOIN ticket t ON t.id_ticket = last_ticket.id_ticket\n  LEFT JOIN tramites tr ON t.id_tramites = tr.id\n  WHERE (c.estado ='ACTIVO' OR c.estado='CANCELADO')";
  var params = [];

  if (nombre) {
    sql += " AND c.nombre LIKE ?";
    params.push('%' + nombre + '%');
  }

  if (apellido_paterno) {
    sql += " AND c.apellido_paterno LIKE ?";
    params.push('%' + apellido_paterno + '%');
  }

  if (apellido_materno) {
    sql += " AND c.apellido_materno LIKE ?";
    params.push('%' + apellido_materno + '%');
  }

  if (clave_ine) {
    sql += " AND c.clave_ine LIKE ?";
    params.push('%' + clave_ine + '%');
  }

  if (fierro) {
    sql += " AND c.iniciales LIKE ?";
    params.push('%' + fierro + '%');
  }

  if (fecha_inicio) {
    sql += ' AND c.fecha_inscripcion >= ?';
    params.push(fecha_inicio);
  }

  if (fecha_fin) {
    sql += ' AND c.fecha_inscripcion <= ?';
    params.push(fecha_fin);
  } else {
    sql += ' AND c.fecha_inscripcion <= IFNULL(?, NOW())';
    params.push(null);
  }

  conexion.query(sql, params, function (err, rows, result) {
    if (err) throw err;
    var data = [];

    for (i = 0; i < rows.length; i++) {
      data.push({
        id_contribuyente: rows[i].id_contribuyente,
        nombre: rows[i].nombre,
        apellido_paterno: rows[i].apellido_paterno,
        apellido_materno: rows[i].apellido_materno,
        clave_ine: rows[i].clave_ine,
        domicilio_ine: rows[i].domicilio_ine,
        domicilio_parcelario: rows[i].domicilio_parcelario,
        fecha_inscripcion: rows[i].fecha_inscripcion,
        perfil: rows[i].perfil,
        fierro: rows[i].fierro,
        libro: rows[i].libro,
        foja: rows[i].foja,
        numero_registro: rows[i].numero_registro,
        estado: rows[i].estado,
        iniciales: rows[i].iniciales,
        folio: rows[i].folio,
        concepto: rows[i].concepto,
        fecha: rows[i].fecha,
        folio_finanzas: rows[i].folio_finanzas,
        notas: rows[i].notas,
        tipo: rows[i].tipo,
        telefono: rows[i].telefono
      });
    }

    res.end(JSON.stringify(data));
  });
});
router.post("/obtener-tramites-contribuyente", authController.isAuthenticated, function (req, res, results) {
  var id_contribuyente = req.query.id_contribuyente;
  conexion.query("SELECT * FROM ticket t LEFT JOIN tramites r on t.id_tramites = r.id WHERE id_contribuyente = ? AND folio_finanzas is not null AND folio_finanzas!='CANCELAR'", [id_contribuyente], function (err, rows, result) {
    if (err) throw err;
    var data = [];

    for (i = 0; i < rows.length; i++) {
      data.push({
        id_ticket: rows[i].id_ticket,
        concepto: rows[i].concepto,
        folio: rows[i].folio,
        fecha: rows[i].fecha,
        hora: rows[i].hora,
        cantidad: rows[i].cantidad,
        importe: rows[i].importe,
        folio_finanzas: rows[i].folio_finanzas
      });
    } // CONVERTIR JSON A STRING


    res.end(JSON.stringify(data));
  });
});
router.get('/perfil', authController.isAuthenticated, function (req, res) {
  var user = req.user.id;
  conexion.query("SELECT * FROM usuarios WHERE id = ?", [user], function (error, results) {
    if (error) {} else {
      res.render('perfil', {
        user: req.user,
        alert: false
      });
    }
  });
});
router.post("/updateContrasena", authController.isAuthenticated, function (req, res) {
  var user = req.user.id;
  var pass = req.body.passNueva;
  conexion.query("UPDATE usuarios SET pass = \"".concat(pass, "\", fecha_actual = CURRENT_TIMESTAMP WHERE id = \"").concat(user, "\""), function (error, results) {
    if (error) {} else {
      res.redirect('/perfil');
    }
  });
});
router.get('/usuarios', authController.isAuthenticated, function (req, res) {
  if (req.user.tipo === 'Administrador') {
    res.render('usuarios', {
      user: req.user
    }); // renderiza el archivo HTML
  } else {
    res.redirect('/ticket'); // renderiza el archivo HTML
  }
});
router.get("/searchUsuarios", authController.isAuthenticated, function (req, res, results) {
  conexion.query("SELECT * FROM usuarios WHERE categoria='fierros'", function (err, rows, result) {
    if (err) throw err;
    var data = [];

    for (i = 0; i < rows.length; i++) {
      data.push({
        id: rows[i].id,
        user: rows[i].user,
        nombre: rows[i].nombre,
        tipo: rows[i].tipo,
        fecha_creacion: rows[i].fecha_creacion,
        fecha_actual: rows[i].fecha_actual
      });
    } // CONVERTIR JSON A STRING


    res.end(JSON.stringify(data));
  });
});
router.post("/usuariosInsert", authController.isAuthenticated, function (req, res) {
  var categoria = req.user.categoria;
  var informacion = req.user.usuario_informacion;
  var id = req.query.id;
  var user = req.query.user;
  var nombre = req.query.nombre;
  var pass = req.query.pass;
  var tipo = req.query.tipo;

  if (id) {
    conexion.query("UPDATE usuarios SET user = \"".concat(user, "\", nombre = \"").concat(nombre, "\", tipo = \"").concat(tipo, "\" WHERE id = \"").concat(id, "\""), function (error, result) {
      if (error) {
        throw error;
      } else {
        res.redirect('/ticket');
      }
    });
  } else {
    conexion.query("INSERT INTO usuarios (user,  nombre, pass, tipo, categoria, usuario_informacion, fecha_creacion) VALUES \n    (\"".concat(user, "\",  \"").concat(nombre, "\",\"").concat(pass, "\",\"").concat(tipo, "\",\"").concat(categoria, "\",\"").concat(informacion, "\", CURRENT_TIMESTAMP)"), function (error, result) {
      if (error) {
        throw error;
      } else {
        res.redirect('/ticket');
      }
    });
  }
});
router.get('/pruebas', function (req, res) {
  res.render('pruebas'); // renderiza el archivo HTML
});
router.post("/logins", authController.logins);
router.get("/logout", authController.logout);
module.exports = router;