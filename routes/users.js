import express from "express";
const router = express.Router();
import auth from "../middleware/auth.js";

import UserController from "../controllers/UserController.js";

//File upload
import multer from "multer";
const upload = multer({
    // dest: "./public/avatars",
    limits:{
        fileSize: 1000000

    },
    fileFilter(req, file, cb){
        if (!file.originalname.match(/\.(jpeg|jpg|png)$/)){
           return  cb(new Error("Please Upload an image file"));
        }
        cb(undefined, true)
    }
},);

const errorMiddleware = (req, res, next) => {
    throw new Error("Error occurred")
}

//My profile
router.get('/me', auth, UserController.index);

//Sign up
router.post('/register', UserController.store);

//upload profile photo
router.post('/me/avatar', auth, upload.single("avatar"), UserController.uploadProfileImage, (error, req, res, next) => {
    res.status(400).send({error: error.message});
});

//Get profile picture
router.get('/:id/avatar', UserController.getProfilePicture);

//Remove profile image
router.delete('/me/avatar', auth, UserController.removeProfileImage);


//Login
router.post('/login', UserController.login);

//Logout
router.post('/logout', auth, UserController.logout);

//Logout from all sessions
router.post('/logoutAll', auth, UserController.logoutAll);


router.get('/:id', auth, UserController.show);

//Update
router.patch('/me', auth, UserController.update);

//Delete User
router.delete('/me', auth, UserController.destroy);



export default router;