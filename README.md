# 381project
To Do List System

Group: 58
Name: Yip Ding Yam (12663591), Lui Ka Ho (13087673), Singh Ramandeep (12892965)\

Application link: https://three81project-0h4x.onrender.com
********************************************
# Login
Through the login interface, each user can access the restaurant information management system by entering their username and password.

Each user has a userID and password;
[
	{userid: user1, password: 12345},
	{userid: user2, password: 23456},
	{suerid: user3, password: 34567}

]

After successful login, username is stored in seesion.

********************************************
# Logout
In the home page, each user can log out their account by clicking logout.

********************************************
# CRUD service
- Create
-	A To Do List document may contain the following attributes with an example: 
	1)	event ID (formed by the 12 digit time ID  e.g.YYYY-MM-DD-TIME 202311230900)
	2)	To Do event (e.g. study)
	3)	Venue (e.g. HKMU)
	4)	Detail 
	

Event ID is mandatory, and other attributes are optional.

********************************************
# CRUD service
- Read
- 
Searching by event ID
	input id of event you want to find (00000003);
	id is in the body of post request, and in display.ejs all the information of the event will be shown
********************************************
# CRUD service
- Update
-	The user can update the event information through the details interface.
-	Among the attribute shown above, Event ID cannot be changed. Since Event ID is fixed, event ID is searching criteria for updating information. 

-The information that users can change
1)The event (e.g. movie)
2)The venue (e.g. HKMU)
3)The details

********************************************
# CRUD service
- Delete
-	The user can delete the event information through the delete interface by its event ID.

********************************************
# RESTFUL
********************************************
# Post
	1) used for insert and update
 	2) Path URL : /api/item/id/:id
	3) test:
   curl -X POST -H "Content-Type: application/json" --data "{\"id\": \"202311231500\", \"event\":\"study\"}" https://three81project-0h4x.onrender.com/api/item/id/202311231500

  
   curl -X POST -H "Content-Type: application/json" --data "{\"event\": \"movie\", \"venue\":\"Kwai Fung\" , \"detail\":\"no\" }" https://three81project-0h4x.onrender.com/api/item/update/id/202311231500


- you can first use the insert code and then use update code to modify the data stored in the database

********************************************

 # Get
 	1) used for search 
	2) Path URL : /api/item/id/:id
   	3) test:
    curl -X GET https://three81project-0h4x.onrender.com/api/item/id/202311231500

********************************************

# Delete
	1) used for delete
 	2) Path URL : /api/item/id/id 
  	3) test:
   curl -X DELETE https://three81project-0h4x.onrender.com/api/item/id/202311231500
