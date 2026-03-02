require('dotenv').config({path:__dirname+'/../.env'})
const express= require('express')
const router=express.Router()
const auth=require('../middleware/auth')
const Groq= require('groq-sdk')
const groq=new Groq({apikey:process.env.GROQ_API_KEY})

const callGroq = async (prompt) => {
    const response=await groq.chat.completions.create({
        messages:[{role:'user',content:prompt}],
        model:'llama-3.3-70b-versatile',
    })
    return response.choices[0].message.content
}
router.post('/match',auth,async(req,res)=>{
    try{
        const{resume,jobDescription}=req.body
        const prompt=
        `You are a hiring expert.Analyze this resume against the job description and research the company hiring trend and how they hire as well.
    
        Resume:${resume}
        Job Description:${jobDescription}
        Respond in this excact JSON format:
        {
        "matchScore":75,
        "matchedKeywords":[ "JavaScript","React","Node.js"],
        "missingKeywords":["Docker","AWS"],
        "suggestions":"Add more backend experience"

        }
        Return only valid JSON, no extra text.
        
        `
        const result=await callGroq(prompt)
        const parsed=JSON.parse(result)
        res.status(200).json(parsed)
    }catch(error){
        console.error(error)
        res.status(500).json({message:'AI Error'})
    }
})


router.post('/cover-letter',auth,async(req,res)=>{
    try{
        const {resume,jobDescription,company,role}=req.body

        const prompt= 
        ` Write a professional cover letter for this candidate applying to ${role} at${company}.
        
        Resume:${resume}
        Company:${company}
        Job Description:${jobDescription}
        Role:${role}

        Write a compelling 3 paragraph cover letter .Be Specific and Professional and make sound like human not AI.`

         const result=await callGroq(prompt)
         res.status(200).json({coverLetter:result})
         
    }catch(error){
        console.error(error)
        res.status(500).json({message:'AI Error'})
    }
})


router.post('/follow-up', auth,async(req,res)=>{
    try{
        const {company,role,daySinceApplied,notes}=req.body
        const prompt=
        `
        Write a professional follow-up email for a job application.

        Company:${company}
        Role:${role}
        Day Since Applied:${daySinceApplied}
        Notes:${notes}

        Write a short,Professional follow-up email.Max 3 Paragraphs.`

        const result=await callGroq(prompt)
        res.status(200).json({email:result})

    }
    catch(error){
        console.error(error)
        res.status(500).json({message:'AI Error'})
    }
})

module.exports=router