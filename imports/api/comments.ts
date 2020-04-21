import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import { METEOR_NOT_AUTHORIZED } from '../Const';
import { callMethodFactory } from './callMethodFactory';

export enum CommentType {System, User}

export interface CommentDocument {
    _id?: string
    textId: string
    userId: string
    content: string
    type: CommentType
    createdAt: Date
    commentId?: string
    oldText?: string
    newText?: string
}

interface NewCommentDocument {
    textId: string
    content: string
    type: CommentType
    commentId?: string
    oldText?: string
    newText?: string
}

export const CommentCollection = new Mongo.Collection<CommentDocument>('comments');

Meteor.methods({
    'comments.insert'(document: NewCommentDocument) {
        check(document, {
            textId: String,
            content: String,
            type: Number,
            commentId: Match.Maybe(String),
            oldText: Match.Maybe(String),
            newText: Match.Maybe(String),
        });

        if (!this.userId) {
            throw new Meteor.Error(METEOR_NOT_AUTHORIZED);
        }

        const id = CommentCollection.insert({
            ...document,
            userId: this.userId,
            createdAt: new Date(),
        });

        if (Meteor.isServer) {
            Meteor.call('capture.url', id, document.content);
        }

        return id;
    },
})

export const insertComment = callMethodFactory<[NewCommentDocument], string>('comments.insert');