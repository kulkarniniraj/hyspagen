from pony.orm import *

db = Database()

class Student(db.Entity):
    reg_no = Required(str)
    name = Required(str)
    stud_class = Required(str)
    marks = Set('Marks')

class Marks(db.Entity):
    student = Required(Student)
    subject = Required(str)
    marks = Required(int)

models = {'student': Student, 'marks': Marks}

db.bind(provider='sqlite', filename='database.sqlite', create_db=True)

db.generate_mapping(create_tables=True)
