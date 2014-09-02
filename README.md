# agnosticCMS

A purely JavaScript Content Management System, for developers, web-designers and for allowing clients to make some changes to the end result. 

## The Main Concepts

- Agnostic means you are not dependent on any server-side technology. All it needs is a dumb REST API for storing and retrieving data with absolutely no logic on it. You can write the web-service in your favorite language, use one we provide, or even just the one already on our servers by creating a free account (limited to 200MB).

- Our CMS lends itself to sharing pre-made components and templates so a community repository well taken care of is key to the usefulness of Agnostic CMS.

- We wrote it (and keep improving it) to be as much user-friendly as possible so that in an extreme you can even give access to it to your clients so that they can make changes themselves. We integrate tools such as freeWeaver.com to allow for this. 

Why you should use it

- You'll never again have to copy/paste/tailor code you wrote for other projects.
- Leverage what other developers/designers have written without having to write any code yourself.
- Work with a tool that your clients can use to make changes on your projects.
- Do all this without having to learn complex concepts of a pretensions CMS. We keep it as simple as we can.


support

Hey it's agnostic, so we don't care what you want to support! If you use modern and standard web technologies chances are that your applications/websites will be supported everywhere relevant.
The CMS itself is only supported on recent versions of Chrome and Firefox, but that's only to produce the code, the result is up to you.

getting started

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

keeping code in your environment

If you prefer to have your code lodged in your environment please have a look at agnostic-cms-webservice.

Data

We do not offer data hosting, but there are components in the community repository for this. Such as AgnosticRedis4U ComponentFragment and AgnosticRedis4UForm Component, that allow your data to be seamlessly hosted on http://redis4you.com/ under they're policies (we are not associated with redis4you in any form, this is just an example). 

There are also components available on the community repository to help storing your data in your own environment, such as the AgnosticForm Component.


TODO's

finish formatting;
import/export functionality (with description optional);

webservice to create accounts and support the community repository (have to place the name of the user in the add-on);

github page without the sharing with costumers and data part;
ask people to review it;
start working on integrating freeweaver;
add the costumer sharing part to page;

PROVIDE A SIMPLE WAY OF MERGING 2 FOLDERS from the deployable page. this will allow to edit code in a IDE and use the CMS only when necessary, maybe even identify components that changed and put them back into the CMS...wow!
