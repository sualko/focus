import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { METEOR_NOT_AUTHORIZED } from '../Const';

export enum Reaction {Like, Dislike};

export interface ReactionDocument {
    _id?: string
    userId: string
    textId: string
    reaction: Reaction
    createdAt: Date
}



export const ReactionCollection = new Mongo.Collection<ReactionDocument>('reactions');

Meteor.methods({
    'reactions.insert'(textId: string, reaction: Reaction) {
        check(textId, String);
        check(reaction, Number);

        if (!this.userId) {
            throw new Meteor.Error(METEOR_NOT_AUTHORIZED);
        }

        return ReactionCollection.update({
            userId: this.userId,
            textId,
        }, {
            userId: this.userId,
            textId,
            reaction,
            createdAt: new Date(),
        }, {
            upsert: true,
        });
    },
});