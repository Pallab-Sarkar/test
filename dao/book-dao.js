import BookModel from '../model/bookModel.js'

// For Create book
export function create(userDetail){
    return BookModel.create(userDetail)
};

// For update one item
export function updateByCondn(condition, updateFields){
    return BookModel.updateOne(condition, updateFields);
};

//(Delete) Updating audit feilds condition, so that we can track in future
export function deleteItem(condition){
    return BookModel.deleteOne(condition);
};

//Fetching single item
export function getOne(conditions){
    return BookModel.findOne(conditions);
};

//Fetching ALL items from database
export async function getAll  (limit, page,sort,  conditions){
    let list = BookModel.find(conditions).limit(limit).skip(page).sort(sort ? sort : { "auditFields.updatedAt": -1 });
    const count = BookModel.countDocuments(conditions);
    const result = await Promise.all([list, count]);
    return { data: result[0], count: result[1] };
}



