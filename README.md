This is a backend app for creating, getting, updating, and deleting users and their tasks built with the Express framework, the MongoDB database, and Mongoose as an ODM for it.

## Features

+ Filtering, sorting and pagination are done using interaction with the **MongoDB** via **Mongoose**
+ Middleware function checkIsAuthorized is made for task methods, **JWT** is used for authorization
+ Centralized error handling is done using a special ErrorHandler class and a function for direct handling handleError, in which the error is logged using the **Pino** library in the app.log file
+ **API documentation** is done via Postman: https://documenter.getpostman.com/view/38796492/2sAXxQdX7s
+ Email and password are checked using regular expressions
+  Users have the ability to upload a avatar, a special name of which will be saved in the database, and the file itself on the server
+  Two user roles are implemented: **USER** and **ADMIN**, roles are stored in the token, only the admin can delete users
