const Users = require('../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const {CLIENT_URL} = process.env
const userCtrl = {
    register: async (req, res) => {
        try {
            const {name, email, password} = req.body
            
            if(!name || !email || !password)
                return res.status(400).json({msg: "Please fill in all fields."})

            const user = await Users.findOne({email})
            if(user) return res.status(400).json({msg: "This email already exists."})

            if(password.length < 6)
                return res.status(400).json({msg: "Password must be at least 6 characters."})

            // const passwordHash = await bcrypt.hash(password, 12)
            /// dsahjadsadsdfadfsadsads'jk;dsjklasdf // 123456

            const newUser = {
                name, email, password,
            }

            const activation_token = createActivationToken(newUser)

            const url = `${CLIENT_URL}/user/activate/${activation_token}`

            res.json({msg: "Register Success! Please activate your email to start."})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    login: async (req, res) => {
        try {
            const {email, password} = req.body
            console.log(email,password)
            const user = await Users.findOne({'email':email})
            console.log(user);
            if(!user) return res.status(400).json({msg: "This email does not exist."})
            console.log(password == user.password)
            const isMatch = password == user.password ? true : false
            if(!isMatch) return res.status(400).json({msg: "Password is incorrect."})
            const refresh_token = createRefreshToken({id: user._id})
            res.cookie('refreshtoken', refresh_token, {
                httpOnly: true,
                path: '/user/refresh_token',
                maxAge: 7*24*60*60*1000 // 7 days
            })

            res.json({msg: "Login success!"})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },    getAccessToken: (req, res) => {
        try {
            const rf_token = req.cookies.refreshtoken
            if(!rf_token) return res.status(400).json({msg: "Please login now!"})

            jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
                if(err) return res.status(400).json({msg: "Please login now!"})

                const access_token = createAccessToken({id: user.id})
                res.json({access_token})
            })
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }     
    } 
}
const createActivationToken = (payload) => {
    return jwt.sign(payload, process.env.ACTIVATION_TOKEN_SECRET, {expiresIn: '5m'})
}
const createRefreshToken = (payload) => {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '7d'})
}
module.exports = userCtrl