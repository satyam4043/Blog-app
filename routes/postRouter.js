const express=require('express');
const { deletePost, createPost, updatePost, getAllUserPost, getSingleUserPost, updateLike, addComment, deleteComment } = require('../controllers/postController');
const checkToken = require('../middleware/checkToken');

const router=express.Router();



router.post('/create',checkToken,createPost);
router.delete('/delete/:_id',deletePost);
router.put('/update/:_id',updatePost);
router.get('/getall',getAllUserPost);
router.get('/getSingleUser',checkToken,getSingleUserPost);
router.put('/updatelike/:postId',checkToken,updateLike)
router.post('/addcomment/:postId',checkToken,addComment)
// router.get('/getcomments/:postId',getSinglePostComments);
router.delete('/deletecomment/:postId/:commentId',deleteComment)


module.exports=router