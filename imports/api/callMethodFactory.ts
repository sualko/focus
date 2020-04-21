import { Meteor } from "meteor/meteor";

export function callMethodFactory<Arguments extends Array<any>, Data = any>(name: string) {
    return (...args: Arguments) => {
        return new Promise<Data>((resolve, reject) => {
            Meteor.call(name, ...args, (err: any, data: Data) => {
                if (err) {
                    reject(err);

                    return;
                }

                resolve(data);
            });
        });
    }
}