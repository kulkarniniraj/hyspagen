from pony.orm import *

db = Database()

class User(db.Entity):
    name = Required(str)
    phone = Required(str)
    age = Required(int)

db.bind(provider='sqlite', filename='database.sqlite', create_db=True)

db.generate_mapping(create_tables=True)
