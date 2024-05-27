# Flight Roster System

## Project Synopsis
An online tool called the Flight Roster System is intended to be used in the creation and administration of flight rosters for fictitious airlines. In order to ensure effective flight preparation and administration, it makes it easier to organize flight information, such as passenger lists and assignments for the cockpit and cabin personnel.

### Features 
- **Flight Selection:** Users have the option to filter flights based on a variety of parameters or choose flights based on their unique number.
- **Roster Views:** Provides tabular, plane, and expanded views, among other views, for roster data.
- **Automated Crew Assignment:** Complies with specified limitations and supports both automated and manual flight and cabin crew assignment.
- **Seat Assignment:** This feature automatically assigns seats to travelers, giving those without reserved seats extra priority.
- **Export Data:** enables the export of roster data in the JSON format for usage outside of the system.

### Instructions
**Database Setup**
- Clone this github into your IDE
- download PostgreSQL from here https://www.enterprisedb.com/downloads/postgres-postgresql-downloads get version 15.6
- set up postgreSQL with all default settings except for password which should be "admin"
- (optional) open pgAdmin4, click on PostgreSQL 15, select "create server", name server "myserver"
- At the selected server, click on database, select "create database", name database as "mydatabase"
- In IDE, open terminal, go to project directory, type cd ./backend/demo
- type pip install psycopg2
- type py manage.py makemigrations
- type py manage.py migrate
- Check if data tables are created by going into pgAdmin4
- In your database->schema->tables should show your data tables

**populate_db (WIP)**

The function populate_db can be used to generate fake database entries for testing purposes
Currently the function can generate, Passenger, FlightCrew, CabinCrew and Dish entries

-To use:

py manage.py populate_db [Model] [amount]

-Example:

py manage.py populate_db Passenger 100 


-Alternatively an automatic creation can be made with:


py manage.py populate_db generate_database


for an example database to test with


get node.js if not already present and download npm:

https://docs.npmjs.com/downloading-and-installing-node-js-and-npm


-After getting a database run these in seperate terminals:


py manage.py runserver


npm start

these should start a server at localhost:3000 
