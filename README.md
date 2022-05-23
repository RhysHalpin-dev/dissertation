# dissertation - Covid smartcard entry system


PROTOTYPE SYSTEM CREATED AS PART OF DISSERTATION PROJECT.

# Abstract 

The core purpose of this project was to create an entry / exit system to cater towards the current ongoing covid pandemic. Identifying that current building entry systems such as the universities offer basic smartcard functionality without automatic covid temperature screening. In most cases temperature screening is becoming common place in workspaces, however it is usually carried out manually or by a separate system after entry. This study aimed to combine this type of entry system with a covid screening system that could be remotely administrated from a web app thus keeping attendees safer and if deployed could lead to reduced covid transmission within enclosed environments where deployed.  

## The final overall system consisted of 3 key subsystems.
*  A web app built in HTML 5, CSS and REACT JS for rendering the visual side administrators would interact with. 
*  A web server built with NODE JS to process data GET and POST requests from both the web app and Embedded entry screening device. 
*  An embedded device built with a Raspberry pi zero, AMG8833 Thermal camera and a rc522 RFID reader with software created in the Python programming language to take the users temperature and smartcard data during the entry process. 

The project Identified that it is possible for a secure system of this type to be integrated with temperature screening functionality that can limit the number of attendees and can flag potential covid cases before entry, thus eliminating the initial entry of potential cases which could result in a lower transmission and safer environment if deployed . A secure web app platform was also implemented to further remove the physical administration of notifying potential user cases and building entry exit activity offering an all-in-one system consisting of a web app, web server and embedded device. 


## SubSystems
* React App
* Node server
* Raspberry PI

## Tech 
* HTML / CSS
* React 
* Javascript
* MongoDB
* Python
