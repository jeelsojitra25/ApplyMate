const express =require('express')
const router =express.Router()
const bcrypt = require('bcryptjs')
const jwt=require('jsonwebtoken')
const pool =require('../db')

router.post('/register',async(req,res)=>{
    try{
        const{name,email,password}=req.body

        const userExists=await pool.query('SELECT * FROM users WHERE email=$1',[email])

        if(userExists.rows.length>0){
            return res.status(400).json({message: 'Email already registered'})

        }
        const salt=await bcrypt.genSalt(10)
        const hashedPassword=await bcrypt.hash(password,salt)

        const newUser=await pool.query(
            'INSERT INTO users (name,email,password) VALUES ($1,$2,$3) RETURNING id,name,email',
            [name,email,hashedPassword]
        )
        const token =jwt.sign(
            {
                id:newUser.rows[0].id},
                process.env.JWT_SECRET,
                {expiresIn:'7d'}
        )
        res.status(201).json({token,user:newUser.rows[0]})

    }catch(error){
        console.error(error)
        res.status(500).json({message:'Server error'})
    }
})

//Login route

router.post('/login',async(req,res)=>{
    try{
        const {email,password}=req.body
        const user =await pool.query('SELECT *FROM users WHERE email=$1',[email])
        if(user.rows.length===0){
            return res.status(400).json({message:'Invalid credentials'})
        }
        const validPassword=await bcrypt.compare(password,user.rows[0].password)
        if(!validPassword){
            return res.status(400).json({message:'Invalid credentials'})
    
        }
        const token =jwt.sign (
            { id: user.rows[0].id},
                process.env.JWT_SECRET,
                {expiresIn:'7d'}
            
        )
        res.status(200).json({token,user:{id:user.rows[0].id,name: user.rows[0].name,email:user.rows[0].email}})
    }catch(error){
        console.error(error)
        res.status(500).json({message:'Server error'})
        }
})
module.exports=router
