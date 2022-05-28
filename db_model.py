from pony.orm import *

db = Database()

class Employee(db.Entity):
    eid = Required(str)
    name = Required(str)
    expenses = Set('Expense')

class Expense(db.Entity):
    emp = Required(Employee)
    amount = Required(float)
    reason = Required(str)
    
db.bind(provider='sqlite', filename='database.sqlite', create_db=True)

db.generate_mapping(create_tables=True)
