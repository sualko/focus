import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { METEOR_NOT_AUTHORIZED } from '../Const';

export interface ParagraphCommitDocument {
    _id?: string
    userId: string
    paragraphId: string
    content: string
    commitDate: Date
}

export interface TextCommitDocument {
    _id?: string
    userId: string
    textId: string
    content: string
    commitDate: Date
}

interface ParagraphCommitAction {
    paragraphId: string
    content: string
}

interface TextCommitAction {
    textId: string
    content: string
}

export const CommitCollection = new Mongo.Collection<ParagraphCommitDocument|TextCommitDocument>('commits');

Meteor.methods({
    'commits.paragraph'(document: ParagraphCommitAction) {
        check(document, {
            paragraphId: String,
            content: String,
        });

        if (!this.userId) {
            throw new Meteor.Error(METEOR_NOT_AUTHORIZED);
        }

        return CommitCollection.update({
            userId: this.userId,
            paragraphId: document.paragraphId,
        }, {
            ...document,
            userId: this.userId,
            commitDate: new Date(),
        }, {
            upsert: true,
        });
    },
    'commits.text'(document: TextCommitAction) {
        check(document, {
            textId: String,
            content: String,
        });

        if (!this.userId) {
            throw new Meteor.Error(METEOR_NOT_AUTHORIZED);
        }

        return CommitCollection.update({
            userId: this.userId,
            textId: document.textId,
        }, {
            ...document,
            userId: this.userId,
            commitDate: new Date(),
        }, {
            upsert: true,
        });
    },
});