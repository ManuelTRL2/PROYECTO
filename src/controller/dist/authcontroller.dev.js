"use strict";

var jwt = require('jsonwebtoken');

var conexion = require('../database/db');

var _require = require('util'),
    promisify = _require.promisify; // LOGIN DE USUARIOS Y ADMINISTRADORES


exports.logins = function _callee2(req, res) {
  var user, pass;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          try {
            user = req.body.user;
            pass = req.body.pass;

            if (!user || !pass) {
              res.render('login', {
                alert: true,
                alertTitle: "Advertencia",
                alertMessage: "Ingrese un usuario y contraseña",
                alertIcon: 'info',
                showConfirmButton: true,
                timer: false,
                ruta: 'login'
              });
            } else {
              conexion.query('SELECT * FROM usuarios WHERE BINARY user = ? AND BINARY pass = ? AND categoria="fierros"', [user, pass], function _callee(error, results) {
                var id, tipo, token, cookiesOptions;
                return regeneratorRuntime.async(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        console.log(results);

                        if (!results.length) {
                          res.render('login', {
                            alert: true,
                            alertTitle: "Error",
                            alertMessage: "Usuario y/o contraseña incorrectas",
                            alertIcon: 'error',
                            showConfirmButton: true,
                            timer: false,
                            ruta: 'login'
                          });
                        } else {
                          //inicio de sesión OK
                          id = results[0].id;
                          tipo = results[0].tipo;
                          req.tipoUsuario = tipo; // const token = jwt.sign({id:id}, process.env.JWT_SECRETO, {
                          // })
                          //generamos el token SIN fecha de expiracion

                          token = jwt.sign({
                            id: id
                          }, process.env.JWT_SECRETO);
                          console.log("TOKEN: " + token + " para el USUARIO : " + user + pass);
                          cookiesOptions = {
                            expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
                            httpOnly: true
                          };
                          res.cookie('jwt', token, cookiesOptions);

                          if (tipo == 'Administrador') {
                            res.render('login', {
                              alert: true,
                              alertTitle: "Conexión exitosa",
                              alertMessage: "¡LOGIN CORRECTO!",
                              alertIcon: 'success',
                              showConfirmButton: false,
                              timer: 800,
                              ruta: 'pagos'
                            });
                          } else {
                            res.render('login', {
                              alert: true,
                              alertTitle: "Conexión exitosa",
                              alertMessage: "¡LOGIN CORRECTO!",
                              alertIcon: 'success',
                              showConfirmButton: false,
                              timer: 800,
                              ruta: 'ticket'
                            });
                          }
                        }

                      case 2:
                      case "end":
                        return _context.stop();
                    }
                  }
                });
              });
            }
          } catch (error) {
            console.log(error);
          }

        case 1:
        case "end":
          return _context2.stop();
      }
    }
  });
}; // AUTENTIFICAR QUE EXISTE USUARIO LOGUEADO


exports.isAuthenticated = function _callee3(req, res, next) {
  var decodificada;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          if (!req.cookies.jwt) {
            _context3.next = 14;
            break;
          }

          _context3.prev = 1;
          _context3.next = 4;
          return regeneratorRuntime.awrap(promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRETO));

        case 4:
          decodificada = _context3.sent;
          conexion.query('SELECT * FROM usuarios WHERE id = ?', [decodificada.id], function (error, results) {
            if (!results) {
              return next();
            }

            req.user = results[0];
            return next();
          });
          _context3.next = 12;
          break;

        case 8:
          _context3.prev = 8;
          _context3.t0 = _context3["catch"](1);
          console.log(_context3.t0);
          return _context3.abrupt("return", next());

        case 12:
          _context3.next = 15;
          break;

        case 14:
          res.redirect('/');

        case 15:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[1, 8]]);
};

exports.isNotAuthenticated = function _callee4(req, res, next) {
  var decodificada;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          if (!req.cookies.jwt) {
            _context4.next = 7;
            break;
          }

          _context4.next = 3;
          return regeneratorRuntime.awrap(promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRETO));

        case 3:
          decodificada = _context4.sent;
          conexion.query('SELECT tipo FROM usuarios WHERE id = ?', [decodificada.id], function (error, results) {
            var tipo = results[0].tipo;

            if (tipo === 'Administrador') {
              return res.redirect('/pagos');
            } else {
              return res.redirect('/ticket');
            }
          });
          _context4.next = 8;
          break;

        case 7:
          return _context4.abrupt("return", next());

        case 8:
        case "end":
          return _context4.stop();
      }
    }
  });
};

exports.logout = function (req, res) {
  res.clearCookie('jwt');
  return res.redirect('/');
};