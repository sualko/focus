import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { METEOR_NOT_AUTHORIZED } from '../Const';
import { CommentType } from './comments';

export enum Format {
    Text = 'text',
    H1 = 'h1',
    H2 = 'h2',
    H3 = 'h3',
}

export interface ParagraphDocument {
    _id: string
    selectedId: string
    format: Format
    creator: string
    createdAt: Date
    deleted: boolean
}

interface NewParagraphDocument {
    documentId: string
    index: number
    format: Format
    content: string
    comment: string
}

export const ParagraphCollection = new Mongo.Collection<ParagraphDocument>('paragraphs');

Meteor.methods({
    'paragraphs.insert'(document: NewParagraphDocument) {
        check(document, {
            documentId: String,
            index: Number,
            format: String,
            content: String,
            comment: String,
        });

        if (!this.userId) {
            throw new Meteor.Error(METEOR_NOT_AUTHORIZED);
        }

        const paragraphId = ParagraphCollection.insert({
            selectedId: '',
            format: document.format,
            creator: this.userId,
            createdAt: new Date(),
            deleted: false,
        });

        const textId = Meteor.call('texts.insert', {
            content: document.content,
            paragraphId: paragraphId,
        });

        ParagraphCollection.update(paragraphId, {
            $set: { selectedId: textId },
        });

        Meteor.call('documents.updateParagraph', document.documentId, paragraphId, document.index);

        return {paragraphId, textId};
    },
    'paragraphs.updateText'(_id: string, textId: string) {
        check(_id, String);
        check(textId, String);

        if (!this.userId) {
            throw new Meteor.Error(METEOR_NOT_AUTHORIZED);
        }

        //@TODO check _id exists and user is allowed

        ParagraphCollection.update(_id, {
            $set: { selectedId: textId },
        });
    },
    'paragraphs.delete'(_id: string) {
        check(_id, String);

        if (!this.userId) {
            throw new Meteor.Error(METEOR_NOT_AUTHORIZED);
        }

        //@TODO check _id exists and user is allowed

        ParagraphCollection.update(_id, {
            $set: { deleted: true },
        });
    },
    'paragraphs.restore'(_id: string) {
        check(_id, String);

        if (!this.userId) {
            throw new Meteor.Error(METEOR_NOT_AUTHORIZED);
        }

        //@TODO check _id exists and user is allowed

        ParagraphCollection.update(_id, {
            $set: { deleted: false },
        });
    }
});

export const submitParagraph = (documentId: string, index: number, document: { format: Format, content: string, comment: string }) => {
    return new Promise(resolve => {
        Meteor.call('paragraphs.insert', {
            ...document,
            index,
            documentId,
        }, (err, ids: {paragraphId: string, textId: string}) => {
            if (err) {
                console.warn(err);

                throw err;
            }

            Meteor.call('comments.insert', {
                textId: ids.textId,
                content: document.comment,
                type: CommentType.System,
                newText: document.content,
            }, (err, data) => {
                if (err) {
                    console.warn(err);
                }

                resolve(ids);
            });
        });
    });
}