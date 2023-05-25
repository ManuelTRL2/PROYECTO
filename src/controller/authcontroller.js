const jwt = require('jsonwebtoken')
const conexion = require('../database/db')
const { promisify } = require('util')

// LOGIN DE USUARIOS Y ADMINISTRADORES
exports.logins = async (req, res) => {
    try {
        const user = req.body.user
        const pass = req.body.pass
        if (!user || !pass) {
            res.render('login', {
                alert: true,
                alertTitle: "Advertencia",
                alertMessage: "Ingrese un usuario y contraseña",
                alertIcon: 'info',
                showConfirmButton: true,
                timer: false,
                ruta: 'login'
            })
        } else {
            conexion.query('SELECT * FROM usuarios WHERE BINARY user = ? AND BINARY pass = ? AND categoria="fierros"', [user, pass], async (error, results) => {
                console.log(results)
                if (!results.length) {
                    res.render('login', {
                        alert: true,
                        alertTitle: "Error",
                        alertMessage: "Usuario y/o contraseña incorrectas",
                        alertIcon: 'error',
                        showConfirmButton: true,
                        timer: false,
                        ruta: 'login'
                    })
                }
                else {
                    //inicio de sesión OK
                    const id = results[0].id
                    const tipo = results[0].tipo
                    req.tipoUsuario = tipo;
                    // const token = jwt.sign({id:id}, process.env.JWT_SECRETO, {

                    // })
                    //generamos el token SIN fecha de expiracion
                    const token = jwt.sign({ id: id }, process.env.JWT_SECRETO)
                    console.log("TOKEN: " + token + " para el USUARIO : " + user + pass)

                    const cookiesOptions = {
                        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
                        httpOnly: true
                    }
                    res.cookie('jwt', token, cookiesOptions)
                    if (tipo == 'Administrador') {

                        res.render('login', {
                            alert: true,
                            alertTitle: "Conexión exitosa",
                            alertMessage: "¡LOGIN CORRECTO!",
                            alertIcon: 'success',
                            showConfirmButton: false,
                            timer: 800,
                            ruta: 'pagos'
                        })
                    } else {
                        res.render('login', {
                            alert: true,
                            alertTitle: "Conexión exitosa",
                            alertMessage: "¡LOGIN CORRECTO!",
                            alertIcon: 'success',
                            showConfirmButton: false,
                            timer: 800,
                            ruta: 'ticket'
                        })
                    }

                }
            })
        }
    } catch (error) {
        console.log(error)
    }
}


// AUTENTIFICAR QUE EXISTE USUARIO LOGUEADO
exports.isAuthenticated = async (req, res, next) => {
    
    if (req.cookies.jwt) {
        try {
            const decodificada = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRETO)
            conexion.query('SELECT * FROM usuarios WHERE id = ?', [decodificada.id], (error, results) => {

                if (!results) {
                    return next()
                }

                req.user = results[0]
                return next()

            })
        } catch (error) {
            console.log(error)
            return next()

        }

    } else {
        res.redirect('/')
    }
}

exports.isNotAuthenticated = async (req, res, next) => {
    if (req.cookies.jwt) {
            const decodificada = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRETO)
            conexion.query('SELECT tipo FROM usuarios WHERE id = ?', [decodificada.id], (error, results) => {
                const tipo = results[0].tipo
                if (tipo === 'Administrador') {
                    return res.redirect('/pagos');
                  } else {
                    return res.redirect('/ticket');
                  }
            })
    } 
    else{
        return next();
    }
    
}


  
exports.logout = (req, res) => {
    res.clearCookie('jwt')
    return res.redirect('/')
}

