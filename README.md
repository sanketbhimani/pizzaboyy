This is an enterprise level web-application

it contains three parts,

1. admin (jsp-servlet)
2. client-user (html-js)
3. service (node-mongodb)

###description:
-here service is made using node.js and database is mongodb. this service serves all data releted queries. means any node of this application wants to use database, it can use through service.

###how to deploy:

####step 1 (deploy service):

-restore database from backup(/service/db_backup)
~$ mongorestore db_backup/

-start service:
~$ nohup node service.js &

-here nohup is used to sprate the thread of node from currant bash shell

####step 2 (deploy client-user):

-you can host this html site on any apache server
-here one thing should be noticed that the server must be HTTP not HTTPS if your service is not hosted on HTTPS otherwise browser will not allow to send ajex request.

####step 3 (deploy admin):

-you can deploy it on any jsp server like tomcat or glassfish 
