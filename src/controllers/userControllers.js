const userSchema = require("../model/userSchema")
const bcrypt = require("bcryptjs")
const mongoose = require ('mongoose')
const { find } = require("../model/userSchema")

const getAll = async (req, res) => {
    try {
        const allUsers = await userSchema.find()
        res.status(200).json(allUsers)
    } catch (error) {
        res.status(500).json({
            message: error.message,
        })
    }
}

const getUserById = async (req, res) => {
    try{
        const userFound = await userSchema.findById(req.params.id)
        if (userFound){
            res.status(200).json({
                message: `O usuário(a) "${userFound.name}" não foi encontrado(a)`, userFound
            })
        }
    }catch (error){
        res.status(500).json({
            message: `Este usuário(a) não foi encontrado. Verifique se o id existe ou tente novamente mais tarde! ${error.message}`
        })
    }
}

const createUser = async (req, res) => {
    const hashedPassword = bcrypt.hashSync(req.body.password, 10)
    req.body.password = hashedPassword

    try{
        const newUser = new userSchema(req.body) 
        // const newUser = new userSchema({
        //     _id: new mongoose.Types.ObjectId(),
        //     name: req.body.name,
        //     email: req.body.email, 
        //     createdAt: new Date()

        // })

        const savedUser = await newUser.save()

        res.status(200).json({
            message: "Usuário(a) adicionado com sucesso!",
            savedUser
        })

    }catch (error) {
        res.status(500).json({
            message: error.message
        })
    }

}

const updateUserById = async (req, res) =>{
    try{
        const findUser = await userSchema.findById(req.params.id)

        if(findUser){
            findUser.name = req.body.name || findUser.name
            findUser.email = req.body.email || findUser.email
        }

        const savedUser = await findUser.save()

        res.status(200).json({
            message: "Usuário atualizado(a) com sucesso!", savedUser
        })

    }catch (error) {
        res.status(500).json({
            message: error.message,
        })
    }
}

const deleteUserById = async (req, res) => {
    try{
        const userFound = await userSchema.findById(req.params.id);
        
        await userFound.delete()

        res.status(200).json({
            menssagem: `Usuário(a) '${userFound.email}' deletado(a) com sucesso!`
        
    })
    }catch (error) {
    res.status(400).json({
        message: error.message
    })
}
}
module.exports = {
    getAll, 
    getUserById, 
    createUser, 
    updateUserById, 
    deleteUserById
}