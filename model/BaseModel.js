import { Schema as _Schema } from 'mongoose';
const Schema = _Schema;

//Audit schema for better tracking of data
export const AuditFieldSchema = new Schema(
    {
        createdAt: {
            type: Date,
            default: Date.now,
            require: true
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: 'users',
            require: true
        },
        updatedAt: {
            type: Date,
            default: Date.now,
            require: true
        },
        updatedBy: {
            type: Schema.Types.ObjectId,
            ref: 'users',
            require: true
        },
        deletedBy: {
            type: Schema.Types.ObjectId,
            ref: 'users',
            require: true
        },
        isDeleted: {
            type: Boolean,
            default: false,
            require: true
        },
        isActive: {
            type: Boolean,
            default: true,
            require: true
        }
    },
    { _id: false });