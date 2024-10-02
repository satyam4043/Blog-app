 let PostCollection=require('../models/postSchema')
 const createPost=async(req,res)=>{
    const {title,description,file}=req.body;
    let userId=req.user._id;
    try{
        let data=await PostCollection.create({
            title,
            description,
            file,
            userId
        })
        res.json({msg:"post created successfully",success:true,data})

    }catch(error)
    {
        res.json({msg:"erroe in creaing post",success:false,error:error.message})
    }

}
const updatePost=async(req,res)=>{
    let PostId=req.params._id

    const{tittle,description,file}=req.body;
    console.log('id is',PostId)
    try{
        let data=await PostCollection.findByIdAndUpdate({_id:PostId},{$set:{tittle:tittle,description:description,file:file}})
        res.json({msg:"post updated successfully",success:true,data})

    }catch(error){
         res.json({msg:"error in update post",success:false,error:error.message})
    }
    
}
const deletePost=async(req,res)=>{
    let PostId=req.params._id
    try{
        let data=await PostCollection.findByIdAndDelete(PostId)
        res.json({msg:"post deleted sucessfuly",success:true,data})

    }catch(error){
        res.json({msg:"error in deleting post",success:false,error:error.message})

    }
    
}
const getAllUserPost=async(req,res)=>{
    try{
        let data=await PostCollection.find().populate({path:'userId',select:'name'}).populate({
            path:'comments',
            populate:{
                path:'user',
                select:'name'

            }
        });
        return res.json({msg:"post fetched successfully",success:true,data})
        
    }catch(error){
        return res.json({msg:"error in getting post",success:false,error:error.message})
    }
   
}
const getSingleUserPost=async(req,res)=>{
    let _id=req.user._id
    console.log(_id)
    try{
        let data=await PostCollection.find({userId:_id});
        res.json({msg:"post find successfully",success:true,data})

    }catch(error){
         res.json({msg:"error in getting post" ,success:false,error:error.message})
    }
    
}
const updateLike=async(req,res)=>{
    let postId=req.params.postId

    let userId=req.user._id;

    try{

        let post=await PostCollection.findById(postId)

        if(post.likes.includes(userId)){
            await post.likes.pull(userId)
        }else{
            await post.likes.push(userId)
        }
        await post.save();

        res.json({msg:"post like updated successfuly",success:true})
    } catch(error){
         res.json({msg:"error in updating likes",success:false,error:error.message})
    }

}

const addComment=async(req,res)=>{
    let postId=req.params.postId
   const {text}=req.body;
   let userId=req.user._id;
try{
    let post=await PostCollection.findById(postId);
    await post.comments.push({user:userId,text:text})
    await post.save();
    return res.json({msg:"comment added successfilly",success:true})
}catch(error){
   res.json({msg:"error in adding comment",success:false,error:error.message})
}
  
}
// const getSinglePostComments=async(req,res)=>{
//     let postId=req.params.postId;
    // let post=await PostCollection.findById(postId).populate({path:'user'});
//     let post =await PostCollection.findById(postId).populate({
//          path:'comments',
//         populate:{
//             path:'user', 
//             select:'name'
//         }
//     })
//     res.json({msg:"comment fetched successfully",post:post})
// }

const deleteComment=async(req,res)=>{
    const{postId,commentId}=req.params;
    console.log("postId=",postId)
    console.log("commentId=",commentId)

    let post=await PostCollection.findById(postId)
    await post.comments.pull({_id:commentId})
    await post.save()
    res.json({msg:"comment deleted successfully",success:true})
    // let post=await PostCollection.updateOne({_id:postId})
    // let post=await PostCollection.findById(postId);
    // let comment=post.comment

}
module.exports={
    createPost,
    updatePost,
    deletePost,
    getAllUserPost,
    getSingleUserPost,
    updateLike,
    addComment,
    // getSinglePostComments,
    deleteComment,
    




}