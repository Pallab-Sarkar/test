import mongoose from 'mongoose';
const Schema = mongoose.Schema
import { AuditFieldSchema } from './BaseModel.js';
import _ from 'lodash';

//Book schema with specified properties
const BookSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
    },
    summary:{
        type: String,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        require: true
    },
    auditFields: AuditFieldSchema
}, {
    versionKey: false
})

// This function will call before each save() so that we can set auditFields.
BookSchema.pre('save', function (next) {
    
    if (_.isNil(this.auditFields)) {
        this.auditFields = {};
    }
    this.auditFields.updatedAt = new Date();
    if (_.isNil(this.auditFields.createdAt)) {
        this.auditFields.createdAt = new Date();
    }
    if (_.isNil(this.auditFields.isActive)) {
        this.auditFields.isActive = true;
    }
    if (_.isNil(this.auditFields.isDeleted)) {
        this.auditFields.isDeleted = false;
    }
    next();
});

export default mongoose.model('BookModel', BookSchema, 'books');