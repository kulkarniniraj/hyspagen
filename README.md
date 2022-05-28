# HySPAGen
## A Hylang based single page application generator
### V0.1

### What is this?
This is a hylang (python) based single page application generator. It generates API routes and a basic single page html + javascript application per ORM class.

### Why?
This project is inspired from Ruby on Rails and Elixir Phoenix. These two frameworks provide excellent support for generating basic web application just from database specifications. I believe python ecosystem lacks this. Additionally RoR and Phoenix generate a multipage app with support for live updates. I wanted to try out SPA to be closer to current development trend.

### Code organization
Core app is in `server.hy` file. `db_model.py` defines ORM classes (using Pony ORM) 
`external_routes.py` is a file where you can add additional API routes or pages.
`utils.py` provides basic utils.

### How to use it?
This repo comes with a simple example of 2 tables. 
1. Employee table with employee name and id
2. Expense table listing expenses by all employees

Add all custom routes in `external_routes.py` file.

Just install the dependencies and run `hy server.hy` to start server. 
[Default link](http://localhost:5000/) gives links to all individual SPAs.

To change tables, change dict on line 114 of `server.hy`. Key for this dict will be used 
as url prefix and value should be ORM class.

Once you run the application, terminal will list all routes created.

### Dependencies
For backend these libraries/frameworks are used:
- [python flask](https://flask.palletsprojects.com/en/2.1.x/)
- [hylang](https://docs.hylang.org/en/stable/)
- [Pony ORM](https://ponyorm.org/)

For frontend app, these libraries/frameworks are used:
- [preact](https://preactjs.com/)
- [bootstrap](https://getbootstrap.com/)
- [axios](https://www.npmjs.com/package/axios)

### Why hy/ where are routes? 
There are 2 reasons why hylang was used for this project
1. Exploring hy language. Interesting combination of list and python
2. Macros. Python does not provide macros. Obviously there are other ways to generate routes using python, but hy macros seem perfect fit.

For each table, following routes are created using macros:
- /create
- /getone
- /getall
- /update
- /delete
- /getcols

Along with those `/index` is generated which renders SPA.