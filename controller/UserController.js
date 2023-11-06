import { Router } from 'express'
const router = Router()
import { getUserListByCondition, getUser, updateUser, deleteUser } from '../service/userService.js'
import isAuthenticate from '../service/TokenService.js'
import customerLogger  from '../utils/logger.js'

// (GET ALL USER) Getting all user related information
router.post('/getUserListByCondn', isAuthenticate, (req,res) => {
    getUserListByCondition(req).then(result => {
        res.status(200).json({ success: true, message: "User list fetched Successfully", data: result });
    }).catch(err =>{
        customerLogger.error(err)
        res.status(err.status||400).json(err)
    })

})

// (GET SINGLE USER) Fetching single user related information by its id
router.get('/:id', isAuthenticate, (req,res) => {

    getUser(req).then(result => {
        res.status(200).json({ success: true, message: "User fetched Successfully", data: result });
    }).catch(err =>{
        customerLogger.error(err)
        res.status(err.status||400).json(err)
    })

})

// (UPDATE PARTICULAR USER) Update single user data into database 
router.put('/:id', isAuthenticate, (req,res) => {

    updateUser(req, req.params.id, req.body).then(result => {
        res.status(200).json({ success: true, message: "User updated Successfully", data: result });
    }).catch(err =>{
        customerLogger.error(err)
        res.status(err.status||400).json(err)
    })

})

//(DELETE PARTICULAR USER) Delete a user from database
router.delete('/:id', isAuthenticate ,(req,res) => {

    deleteUser(req.params.id).then(result => {
        res.status(200).json({ success: true, message: "User deleted Successfully", data: result });
    }).catch(err =>{
        customerLogger.error(err)
        res.status(err.status||400).json(err)
    })

})

export default router