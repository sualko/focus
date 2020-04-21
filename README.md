# Focus
This is a proof-of-concept for a new collaborative document editor. It focuses
on transparency and auditability. We want you to know why a text has changed and
which was the argument for a paragraph. Especially in large documents it's
important to keep the overview about sections you read and verified. Therefore
you can mark every paragraph as read and see what changed since your marked it.

This application is not ready for production, but it provides already a few very
nice features:

- default admin user with changing password after restart
- user creation
- multiple documents
- basic importer which detects the used format
- marking paragraphs as read
- showing diff between marked and current version
- comments for paragraphs and alternatives
- selection between alternatives
- support for emojis
- voting system for texts
- screenshot import of posted urls
- text edit with history and comment
- shared colorized tags

## Installation
If you have docker installed, a `docker-compose up` should be enough to start
the application. You just have to open `http://localhost:3085` and sign in with
`administrator@localhost` and the printed password. Until you create a new user,
the admin password will be changed on every start.

Developers should run `npm install && npm start` to boot the application.

## Roadmap
Will be there every a stable version? This depends on the community. Currently
there are no active plans to develop this application further.

## Screenshots
Default admin password will be changed on every start, until a user has been created.
![Screenshot ](https://github.com/sualko/focus/raw/main/docs/console-start.png)

Simple sign in.
![Screenshot ](https://github.com/sualko/focus/raw/main/docs/screenshot-signin.png)

Basic user management.
![Screenshot ](https://github.com/sualko/focus/raw/main/docs/screenshot-users.png)

Support for multiple documents.
![Screenshot ](https://github.com/sualko/focus/raw/main/docs/screenshot-documents.png)

Main view with selected unread paragraph and one alternative.
![Screenshot ](https://github.com/sualko/focus/raw/main/docs/screenshot-selected.png)

Adding new paragraphs is easy.
![Screenshot ](https://github.com/sualko/focus/raw/main/docs/screenshot-new-paragraph.png)

This application is already ready for small screens and shows a mini map on the right side.
![Screenshot ](https://github.com/sualko/focus/raw/main/docs/screenshot-mobile-document.png)

On small screens only the document or the selected paragraph is visible.
![Screenshot ](https://github.com/sualko/focus/raw/main/docs/screenshot-mobile-paragraph.png)