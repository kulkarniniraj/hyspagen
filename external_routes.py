from flask import render_template
from pony.orm import db_session

from db_model import Employee, Expense
from utils import app

@db_session
def get_total_expense(eid):
    lst = Expense.select().where(emp = eid)
    total = sum([x.amount for x in lst])
    return total

@app.route('/employee/total/<eid>')
def total_expense(eid):
    return {'total': get_total_expense(eid)}
