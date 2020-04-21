import captureWebsite from 'capture-website';
import getUrls from 'get-urls';
import { Meteor } from 'meteor/meteor';
import { CommentCollection } from '/imports/api/comments';
import crypto from 'crypto';
import path from 'path';

Meteor.methods({
    'capture.url'(commentId: string, content: string) {
        let promises = [];

        for (const url of getUrls(content)) {
            const fileName = crypto.createHash('sha256').update((new Date()).toISOString() + url).digest('hex') + '.png';
            // const filePath = path.join(__meteor_bootstrap__.serverDir, '../web.browser/app', 'screenshots', fileName);
            const filePath = path.resolve('/home/klaus/Repos/focus', 'public', 'screenshots', fileName);

            console.log('url', url, filePath);

            promises.push(captureWebsite.file(url, filePath, {
                // fullPage: true,
                // launchOptions: {
                //     args: ['--no-sandbox', '--disable-setuid-sandbox']
                // }
            }).then(() => {
                console.log(url, fileName);

                return { url, fileName };
            }).catch(err => {
                console.warn(url, err);
            }));
        }

        Promise.all(promises).then(pages => {
            let screenshots: { [url: string]: string } = {};

            pages.forEach(page => {
                if (!page) {
                    return;
                }

                let key = crypto.createHash('sha256').update(page.url).digest('hex');

                screenshots[key] = page.fileName;
            });

            CommentCollection.update(commentId, {
                $set: {
                    screenshots,
                },
            });
        });
    },
});