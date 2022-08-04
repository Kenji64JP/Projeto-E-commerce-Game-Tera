const userSchema = require('../model/userSchema')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const SECRET = process.env.SECRET

const login = (req, res, next) => {
    try {
        userSchema.findOne({ email: req.body.email }, (error, user) => {
            if(!user) {
                return res.status(401).send({
                    message: "User não encontrado(a)",
                    email: `${req.body.email}`
                })
            }

            const validPassword = bcrypt.compareSync(req.body.password, user.password)

            if(!validPassword) {
                return res.status(401).send({
                    message: "Login não autorizado"
                })
            }

            const token = jwt.sign({ name: user.name }, SECRET)

            res.status(200).send({
                message: "Login autorizado",
                token
            })
        })
    } catch(error) {
        res.status(403).send(error)
    }
}

const checkToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Acesso negado!",
      });
    }

    try {
      const secret = process.env.SECRET;
      jwt.verify(token, secret);
      next();
    } catch (error) {
      return res.status(500).json({
        message: "Insira um Token válido!",
      });
    }
}

module.exports = {
    checkToken,
    login
}