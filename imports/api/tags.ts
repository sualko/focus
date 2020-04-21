import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { METEOR_NOT_AUTHORIZED } from '../Const';
import { callMethodFactory } from './callMethodFactory';

export interface TagDocument {
    _id: string
    documentId: string
    textId: string
    label: string
    userId: string
    createdAt: Date
}

interface NewTagDocument {
    documentId: string
    textId: string
    label: string
}

export const TagCollection = new Mongo.Collection<TagDocument>('tags');

Meteor.methods({
    'tags.insert'(document: NewTagDocument) {
        check(document, {
            documentId: String,
            textId: String,
            label: String,
        });

        if (!this.userId) {
            throw new Meteor.Error(METEOR_NOT_AUTHORIZED);
        }

        return TagCollection.insert({
            ...document,
            userId: this.userId,
            createdAt: new Date(),
        });
    },
    'tags.delete'(_id: string) {
        check(_id, String);

        if (!this.userId) {
            throw new Meteor.Error(METEOR_NOT_AUTHORIZED);
        }

        //@TODO check _id exists and user is allowed

        TagCollection.remove(_id);
    },
});

export const insertTag = callMethodFactory<[NewTagDocument], string>('tags.insert');
export const deleteTag = callMethodFactory<[string], void>('tags.delete');