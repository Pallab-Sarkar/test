import { getAllUsers, getOne, updateByCondition, deleteUser as _deleteUser } from "../dao/user-dao.js";
import { prepareUserResponse as prepareUserRes } from "../utils/utils.js";
import { constants } from './../config/constants.js';

function isAdmin(req){
    const authUser = req.user
    return ["ADMIN"].includes(authUser.role)
}

/**
 * Users List
 * req (Request User)
 * return All users list
 */

export async function getUserListByCondition(req) {
    return new Promise(async (resolve, reject) => {
        try {
            const user = req.user
           
            var condition = req.body.conditions ? req.body.conditions : {} ;
            let limit = 0;
            let skip;
            let page;
            let pagination = req.body.pagination;

            //Implemeting pagination for getting the data from DB (Limit, Skip, Sort)
            if (pagination) {
                limit = isNaN(Number(pagination.limit)) ? 10 : Number(pagination.limit);
                page = Number(pagination.page) || 1;
                skip = (pagination.page ? pagination.limit * (pagination.page - 1) : 0);
            } else {
                limit = 0;
                skip = 0;
            }

            if(!user){
                reject({message: "Access Denied",status:403})
            }

            if(req.body.conditions && req.body.conditions.startDate && req.body.conditions.endDate){
                let startDate = moment(new Date(req.body.conditions.startDate)).startOf('day')._d;
                let endDate = moment(new Date(req.body.conditions.endDate)).endOf('day')._d;
                const utcStartDate = startDate.getTime() + (-330) * 60000;
                const utcEndDate = endDate.getTime() + (-330) * 60000;
                condition.createdAt = { $gte : utcStartDate, $lte : utcEndDate}
            }

            //Implementing search term
            if (req.body.searchTerm) {
                let regex = new RegExp(req.body.searchTerm, 'i');
                condition.$or = [{ firstName: regex },{ lastName: regex }, { phoneNumber: regex }, { email: regex }];
            }

            let users = await getAllUsers(limit, skip, req.body.sort, condition);
            
            resolve(prepareUserList(users));

        } catch (error) {
            reject(error);
        }
    })
}

/**
 * Getting single user
 * req (Request Object)
 * return user object
 */
export async function getUser(req){
    return new Promise(async (resolve,reject) => {

        const userId = req.params.id

        const _id = userId

        try {

            const user = await getOne({_id: _id})
            if(user){
                resolve(prepareUserRes(user))
            }else{
                reject({message:"User not found!",status:404})
            }

        } catch (error) {
            reject(error)
        }

    })
}

/**
 * Update User
 * req (Request Object)
 * id (Request params)
 * userData (Request body)
 */
export async function updateUser(req, id, userData) {
    return new Promise(async (resolve, reject) => {
        try {
            let updateFields = {};

            const _id = id || userData._id;

            const existingUser = await getOne({_id: _id})
            if(!existingUser){
                return reject({status: constants.HTML_STATUS_CODE.INVALID_DATA, message:'User not found!!'});
            }

            updateFields = userData;

            if (updateFields.auditFields && updateFields.auditFields.isActive == true) {
                delete updateFields.auditFields;
                updateFields['auditFields.isActive'] = true
                updateFields['auditFields.updatedBy'] = req.user?._id
                updateFields['auditFields.updatedAt'] = new Date()

            }
            if (updateFields.auditFields && updateFields.auditFields.isActive == false) {
                delete updateFields.auditFields;
                updateFields['auditFields.isActive'] = false
                updateFields['auditFields.updatedBy'] = req.user?._id
                updateFields['auditFields.updatedAt'] = new Date()

            }

            // Avoid allowing the user to modify sensitive fields
            if(!isAdmin(req)){
                delete updateFields.isVerified
                delete updateFields.isBlocked
                delete updateFields.otp
            }

            let user = await updateByCondition({_id: _id}, updateFields);
            if (!user || user.modifiedCount !== 1) {
                reject({ message: "unable to update user!" })
            }
            resolve(true);

        } catch (error) {
            reject(error)
        }

    })
}

/**
 * Delete user
 * Params (Request params)
 */
export async function deleteUser(params){
    return new Promise(async (resolve,reject) => {

        const _id = params
        const userDetail = await getOne({_id: params, 'auditFields.isDeleted': false })
        if (!userDetail) {
            return reject({status: constants.HTML_STATUS_CODE.NOT_FOUND, message:'user does not exist !!'});
        }

        try {

            const user = await _deleteUser({_id: _id})
            
            if (!user || user.deletedCount !== 1) {
                return reject({status: constants.HTML_STATUS_CODE.INVALID_DATA, message:'Unable to delete user!'});
            } else{
                resolve(true)
            }

        } catch (error) {
            reject(error)
        }

    })
}

/*
 * return required fields in users list object
 * @param {Object} user
 */
var prepareUserList = async function (res) {

    if(res.data[0] && res.data[0]._doc){
        for await (let element of res.data) {
            delete element._doc.password;
            delete element._doc.otp;
        }
    }
    return res;
}