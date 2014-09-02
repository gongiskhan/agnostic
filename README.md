# agnosticCMS

A purely JavaScript based Content Management System, for developers, web-designers and for allowing clients to make some changes to the end result.

Give it a try by creating an account (TODO: link here once website is up), downloading and running it straight from the file system. Just make sure you use a modern browser such as Chrome.

## The Main Concepts

- Agnostic means you are not dependent on any server-side technology. All it needs is a dumb REST API for storing and retrieving data with absolutely no logic on it. You can write the web-service in your favorite language, use one we provide (simply run a java binary with the web server and database embedded), or even just the one already on our servers by creating a free account (limited to 200MB).

- Our CMS lends itself to sharing pre-made components and templates, so a community repository well taken care of is key to the usefulness of Agnostic CMS.

- We wrote it (and keep improving it) to be as much user-friendly as possible so that in extreme you can even give access to it to your clients so that they can make changes themselves. We integrate tools such as freeWeaver.com (check the demo) to allow for this.

## Why you should use it

- You'll never again have to copy/paste/tailor code you wrote for other projects.
- Leverage what other developers/designers have written without having to write any code yourself.
- Work with a tool that your clients can use to make changes on your projects.
- Do all this without having to learn complex concepts of a CMS. The UI is very intuitive (we believe) and we don't have APIs for you to learn.


## Support

Hey it's Agnostic, so we don't care what you want to support! If you use modern and standard web technologies chances are that your applications/websites will be supported everywhere relevant.
The CMS itself is only supported on recent versions of Chrome and Firefox, but that's only to produce the code, the result is up to you.

## Getting Started

1. Create an account
2. Download Agnostic CMS
3. Open index.html in your browser
4. Go to Downloads/Deployments and download the default Deliverable to understand what it does
5. Create your own layout Template by using the default one as an example
6. Configure it on the default Deliverable
7. Add some Components
8. Add a View using the new components
9. Download the default Deliverable again

That's it, you can now work with Agnostic CMS.
To learn more about it use the help icons information and your intuition, there is no massive documentation to read here.

### Keeping code in your environment

If you prefer to have your code lodged in your environment please have a look at agnostic-cms-webservice.

### Data

We do not offer data hosting, but there are components in the community repository for this. Such as AgnosticRedis4U and AgnosticRedis4UForm, that allow your data to be seamlessly hosted on http://redis4you.com/ under they're policies (we are not associated with redis4you in any form, this is just an example). 

There are also components available on the community repository to help storing your data in your own environment, such as the AgnosticForm Component.

## The History

This project started because we couldn't find a CMS that had front-end developers as the first-class citizens. So that they could reuse they're code easily, make changes quickly, and empower users to edit they're content.
Some CMSs have been used for similar purposes, but some where created with bloggers in mind, others business users, or server-side developers... And JavaScript is the most widely used language in the world! With a enormously bigger percentage of front-end developers than server-side... So why noone ever attempted this... We came to the conclusion that the only reason was storage. CMSs usually have a premise, they must have access to a Database, in fact they usually heavily rely on the Database, sometimes even to keep logic! 
Take away that premise and voilà, you can have all your CMS logic on the client-side, which a front-end developer can understand.
So, to achieve this, agnosticCMS relies on a REST service that can be written on any server-side language (we considered Web Storage and File API). All the REST API does is store data. It doesn't have any rules, in fact it doesn't even care about the data structure as it creates tables dynamically. So, developers only need to  find or write a simple implementation that fullfils the API contract on CRUD operations (TODO: link here), download the full blown agnostic-webservice ready to run (database and web-container embedded, and hey, it's just Storage! you don't need to know the language it's written on), or choose to use our cloud storage (default) and they are ready to go. The CMS is used straight from the file system and should grow into running everywhere (this initial version is for desktops) as it is based on standard web technologies with responsive techniques (that haven't been tested or adjusted yet).
