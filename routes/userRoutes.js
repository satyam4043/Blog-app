const express=require('express');
const { updateUser, createUser, loginUser, deleteUser, forgetPassword, getToken, passwordResetFinally, getUserDetails } = require('../controllers/userController');
const checkToken = require('../middleware/checkToken');
const router=express.Router();


router.post('/create',createUser)
router.put('/update',checkToken,updateUser)
router.post('/login',loginUser)
router.delete('/delete/:_id',checkToken,deleteUser)
router.post('/forget-password',forgetPassword)
router.get('/reset-password/:token',getToken)
router.post('/reset-password/:token',passwordResetFinally)
router.get('/getUser',checkToken,getUserDetails)
module.exports=router