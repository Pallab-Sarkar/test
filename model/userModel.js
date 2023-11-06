import { Schema as _Schema, model } from 'mongoose';
const Schema = _Schema;
import { AuditFieldSchema } from './BaseModel.js'
import _ from 'lodash';

//user schema
const UserSchema = new Schema({
    fullName: {
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    otp: {
        type: String
    },
    role: {
        type: String,
        enum:["MEMBER","ADMIN"],
        required: true
    },
    isVerified:{
        type: Boolean,
        default: false
    },
    isBlocked:{
        type: Boolean,
        default: false
    },
    auditFields: AuditFieldSchema
}, {
    versionKey: false
})

// This function will call before each save() so that we can set auditFields.
UserSchema.pre('save', function (next) {
    
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

export default model('UserModel', UserSchema, 'users');