const express = require('express')
const cors=require('cors')

require('dotenv').config()


const aiRoutes=require('./routes/ai')
const authRoutes =require('./routes/auth')

const applicationRoutes =require('./routes/applications')

const app=express()


//middleware
app.use(cors())
app.use(express.json())
app.use('/api/ai',aiRoutes)

//Route
app.use('/api/auth',authRoutes)
app.use('/api/applications',applicationRoutes)
//Test route    
app.get('/',(req,res)=>{
    res.json({message:'Applymate API is running!'})
})


//Start server
const PORT=process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})