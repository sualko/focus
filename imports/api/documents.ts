import { Mongo } from 'meteor/mongo';
import UserDocument from './users';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { METEOR_NOT_AUTHORIZED, METEOR_NOT_FOUND } from '../Const';

export interface DocumentDocument {
    _id: string
    // roomId: string
    title: string
    description: string
    paragraphs: string[]
    creator: string
    createdAt: Date
    users: { [_id: string]: UserDocument }
}

interface NewDocumentDocument {
    title: string
    description: string
}

export const DocumentCollection = new Mongo.Collection<DocumentDocument>('documents');

Meteor.methods({
    'documents.insert'(document: NewDocumentDocument) {
        check(document, {
            title: String,
            description: String,
        });

        if (!this.userId) {
            throw new Meteor.Error(METEOR_NOT_AUTHORIZED);
        }

        const _id = DocumentCollection.insert({
            ...document,
            paragraphs: [],
            creator: this.userId,
            createdAt: new Date(),
            users: {}
        });

        return _id;
    },
    'documents.updateParagraph'(_id: string, paragraphId: string, index: number) {
        check(_id, String);
        check(paragraphId, String);
        check(index, Number);

        if (!this.userId) {
            throw new Meteor.Error(METEOR_NOT_AUTHORIZED);
        }

        const document = DocumentCollection.findOne(_id, { fields: { paragraphs: 1 } });

        if (!document) {
            throw new Meteor.Error(METEOR_NOT_FOUND);
        }

        let paragraphs = document.paragraphs.filter(id => id !== paragraphId);

        console.log('paragraphs', paragraphId, paragraphs);

        paragraphs.splice(index, 0, paragraphId);

        console.log('paragraphs 2', index, paragraphs);

        DocumentCollection.update(_id, {
            $set: { paragraphs },
        });
    }
});