import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { METEOR_NOT_AUTHORIZED, METEOR_NOT_FOUND } from '../Const';
import { callMethodFactory } from './callMethodFactory';

export interface TextDocument {
    _id: string
    paragraphId: string
    ownerId: string
    content: string
    createdAt: Date
}

interface NewTextDocument {
    content: string
    paragraphId: string
}

interface UpdateTextDocument {
    content: string
}

export const TextCollection = new Mongo.Collection<TextDocument>('texts');

Meteor.methods({
    'texts.insert'(document: NewTextDocument) {
        check(document, {
            content: String,
            paragraphId: String,
        });

        if (!this.userId) {
            throw new Meteor.Error(METEOR_NOT_AUTHORIZED);
        }

        return TextCollection.insert({
            content: document.content,
            paragraphId: document.paragraphId,
            ownerId: this.userId,
            createdAt: new Date(),
        });
    },
    'texts.update'(_id: string, document: UpdateTextDocument) {
        check(_id, String);
        check(document, {
            content: String,
        });

        const text = TextCollection.findOne(_id);

        if (!text) {
            throw new Meteor.Error(METEOR_NOT_FOUND);
        }

        if (!this.userId || this.userId !== text.ownerId) {
            throw new Meteor.Error(METEOR_NOT_AUTHORIZED);
        }

        TextCollection.update(_id, {
            $set: document
        });
    }
});

export const insertText = callMethodFactory<[NewTextDocument], string>('texts.insert');