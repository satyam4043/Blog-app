const express=require("express")
const app=express()
const port=8080;
const connection=require("./db")

connection()

const cors=require('cors')

// let userCollection=require('./models/UsersSchema')

let userRouter=require('./routes/userRoutes')
let postRouter=require('./routes/postRouter')

app.use(cors());
app.set('view engine','ejs')
app.use(express.json({limit:"50mb"}))

 app.get("/",(req,res)=>{
    res.send('kaam huya')
})

// app.post('/create',async(req,res)=>{
//     let {name,email,password}=req.body;

//     let data=await userCollection.create({
//         name:name,
//         email:email,
//         password:password
//     })
    // res.json({msg:"user created successfully",success:true,data})
   
// })

app.use('/users',userRouter)
app.use('/posts',postRouter)

app.listen(port,()=>{
    console.log(`server is running'${port}`)
 })


