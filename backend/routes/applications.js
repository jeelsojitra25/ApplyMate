const express=require('express')
const router=express.Router()
const pool = require('../db')
const auth=require('../middleware/auth')

//Get Application for logged in user

router.get('/',auth,async(req,res)=>{
    try{
        const applications = await pool.query(
            'SELECT * FROM applications WHERE user_id=$1 ORDER BY created_at DESC',
            [req.user.id]

        )
        res.status(200).json(applications.rows)

    }catch(error){
        console.error(error)
        res.status(500).json({message:'Server Error'})
    }
})


router.post('/',auth,async(req,res)=>{
    try{
        const{
            company,role,status,applied_date,follow_up_date,job_url,notes
        }=req.body
        const newApp =await pool.query(
            'INSERT INTO applications(user_id,company,role,status,applied_date,follow_up_date,job_url,notes) VALUES($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *',
            [req.user.id,company,role,status,applied_date,follow_up_date,job_url,notes]

        )
        res.status(201).json(newApp.rows[0])
    }catch(error){
        console.error(error)
        res.status(500).json({message:'Server error'})
    }
})


router.put('/:id',auth,async(req,res)=>{
    try{
        const{company,role,status,follow_up_date,job_url,notes}=req.body
        const updateApp=await pool.query(
            'UPDATE applications SET company=$1,role=$2,status=$3,follow_up_date=$4,job_url=$5,notes=$6 WHERE id=$7 AND user_id=$8 RETURNING *',
            [company,role,status,follow_up_date,job_url,notes,req.params.id,req.user.id]

        )
        if(updateApp.rows.length===0){
            return res.status(404).json({message:'Application not found'})
        }
        res.status(200).json(updateApp.rows[0])
    
    }catch (error){
        console.error(error)
        res.status(500).json({message:'Server error'})
    }   
})

router.delete('/:id',auth, async(req,res)=>{
    try{
        await pool.query(
            'DELETE FROM applications WHERE id=$1 AND user_id=$2',
            [req.params.id,req.user.id]
        )
        res.status(200).json({message:'Application deleted'})
    }
    catch(error){
        console.error(error)
        res.status(500).json({message:'Server error'})
    }
})

router.get('/stats',auth,async(req,res)=>{
    try{
        const stats=await pool.query(
            `SELECT 
            COUNT(*) as total,
            SUM(CASE WHEN status='Applied' THEN 1 ELSE 0 END) as applied,
            SUM(CASE WHEN status='Interviewing' THEN 1 ELSE 0 END) as interviewing,
            SUM(CASE WHEN status='Offer'THEN 1 ELSE 0 END) as offer,
            SUM(CASE WHEN status='Rejected'THEN 1 ELSE 0 END) as rejected
            FROM applications WHERE user_id=$1`,
            [req.user.id]
        )
        res.status(200).json(stats.rows[0])
    }
    catch(error){  
        console.error(error)
        res.status(500).json({message:'Server error'})
    }
})    

module.exports=router