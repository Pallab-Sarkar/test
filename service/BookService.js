import { create, getAll, getOne, updateByCondn, deleteItem as _deleteItem } from "../dao/book-dao.js";
import { constants } from "../config/constants.js";

//Returns Item detail & Creating book into DB
export async function createBook(req,data){
    return new Promise(async (resolve,reject) => {
        if (!data && !data.dummyKey1) {
            return reject({status: constants.HTML_STATUS_CODE.INVALID_DATA, message:'Invalid Data !!'});
        }
        if(!req.user){
            return reject({status: constants.HTML_STATUS_CODE.UNAUTHORIZED, message:'Unauthorized !!'});
        }
        const authUser = req.user;

        data['userId'] = authUser?._id
        data['auditFields.createdBy'] = authUser?._id
        data['auditFields.updatedBy'] = authUser?._id

        try {
           
            const result = await create(data);
            if(result){
                resolve(result)
            }else{
                reject({message:"Book could not be created"})
            }
        } catch (error) {
            reject(error)
        }

    })
}

//Get all item with details
export async function getAllList(req, bodyData) {
    return new Promise(async (resolve, reject) => {
        try {
           
            let condition = bodyData.conditions ? bodyData.conditions : {}
            let limit = 0;
            let skip;
            let page;
            let pagination = bodyData.pagination;

            //implementing pagination (Limit, Sort, Skip)
            if (pagination) {
                limit = isNaN(Number(pagination.limit)) ? 10 : Number(pagination.limit);
                page = Number(pagination.page) || 1;
                skip = (pagination.page ? pagination.limit * (pagination.page - 1) : 0);
            } else {
                limit = 0;
                skip = 0;
            }
            condition['auditFields.isDeleted'] = false

            //implementing search term
            if (req.body.searchTerm) {
                let regex = new RegExp(req.body.searchTerm, 'i');
                condition.$or = [{ title : regex }, { author : regex }, { summary : regex }];
            }

            let allItem = await getAll(limit, skip, req.body.sort, condition);
            
            resolve(allItem)

        } catch (error) {
            reject(error)
        }
    })
}

//Fetch single item from DB
export async function getBookById(params){
    return new Promise(async (resolve,reject) => {
        const _id = params

        try {

            const itemDetail = await getOne({_id: _id, 'auditFields.isDeleted': false})
            if(itemDetail){
                resolve(itemDetail)
            }else{
                reject({message:"Item not found!",status:404})
            }

        } catch (error) {
            reject(error)
        }

    })
}

//Update Book
export async function updateBook(req,updateFields){
    return new Promise(async (resolve,reject) => {
        if (!(req.params && req.params.id)) {
            return reject({status: constants.HTML_STATUS_CODE.INVALID_DATA, message:'Invalid book id !!'});
        }
        if (!updateFields) {
            return reject({status: constants.HTML_STATUS_CODE.INVALID_DATA, message:'Invalid Data !!'});
        }
        if (!req.user){
            return reject({status: constants.HTML_STATUS_CODE.UNAUTHORIZED, message:'Unauthorized !!'});
        }
        const authUser = req.user

        const itemDetail = await getOne({_id: req.params.id, 'auditFields.isDeleted': false})
        if(!itemDetail){
            return reject({status: constants.HTML_STATUS_CODE.INVALID_DATA, message:'Book does not exist !!'});
        }
    
        if (updateFields._id) {
            delete updateFields._id;
        }

        updateFields['auditFields.updatedBy'] = authUser._id
        updateFields['auditFields.updatedAt'] = new Date()
        try {
            const update = await updateByCondn({_id: req.params.id, 'auditFields.isDeleted': false}, updateFields);
            if (!update || update.modifiedCount !== 1) {
                return reject({status: constants.HTML_STATUS_CODE.INVALID_DATA, message:'Unable to update Book!!'});
            }
            
            resolve(update)
        } catch (error) {
            reject(error)
        }
    })
}

//Delete particular item from DB
export async function deleteBook(req ,params){
    return new Promise(async (resolve,reject) => {
        if (!params) {
            return reject({status: constants.HTML_STATUS_CODE.INVALID_DATA, message:'Invalid Book ID !!'});
        }
        if (!req.user){
            return reject({status: constants.HTML_STATUS_CODE.UNAUTHORIZED, message:'Unauthorized !!'});
        }

        const itemDetail = await getOne({_id: params})
        if (!itemDetail) {
            return reject({status: constants.HTML_STATUS_CODE.NOT_FOUND, message:'Item does not exist !!'});
        }
    
        try {
            const result = await _deleteItem({_id: params});
            if (!result) {
                return reject({status: constants.HTML_STATUS_CODE.INVALID_DATA, message:'Unable to delete book!!'});
            }
            
            resolve(true)
        } catch (error) {
            reject(error)
        }
    })
}