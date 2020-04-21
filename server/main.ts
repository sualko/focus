import { Meteor } from 'meteor/meteor';
import '/imports/api/documents';
import '/imports/api/texts';
import '/imports/api/paragraphs';
import '/imports/api/commits';
import '/imports/api/comments';
import '/imports/api/reactions';
import '/imports/api/tags';
import './capture';
import { Accounts } from 'meteor/accounts-base';
import crypto from 'crypto';

Meteor.startup(() => {

  const password = crypto.randomBytes(16).toString('hex');
  const numberOfUsers = Meteor.users.find().count();

  console.log('Admin password: ', password);

  if (numberOfUsers === 0) {
    Accounts.createUser({
      username: 'administrator',
      email: 'administrator@localhost',
      password,
      profile: {
        name: 'Administrator',
      },
    });
  } else if (numberOfUsers === 1) {
    const user = Meteor.users.findOne({username: 'administrator'});

    if (user) {
      Accounts.setPassword(user._id, password, {
        logout: true,
      });
    }
  }
});
