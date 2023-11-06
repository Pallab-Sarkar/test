import UserModel from '../model/userModel.js'

//Creating user in database
export function create(bodyData){
    return UserModel.create(bodyData)
}

//Fetching single user from database
export function getOne(condition){
    return UserModel.findOne(condition)
}

// For Update Single User Detail
export function updateByCondition(condition, updateFields){
    return UserModel.updateOne(condition, { $set: updateFields });
};

//(Delete) Actually updating audit fields, so that we can track user in future
export function deleteUser(id){
    return UserModel.updateOne({ '_id': id }, { $set: { 'auditFields.isDeleted': true, 'auditFields.isActive': false } });
};

//Fetching all User
export async function getAllUsers(limit, page, sort, conditions){
    let data = UserModel.find(conditions).limit(limit).skip(page).sort(sort ? sort : { 'auditFields.updatedAt': -1 })
    .populate({
        path:'auditFields.updatedBy',
        model: 'UserModel',
        select:'fullName email userId'
    });
    const count = UserModel.countDocuments(conditions);
    const result = await Promise.all([data, count]);
    return { data: result[0], count: result[1] };
}