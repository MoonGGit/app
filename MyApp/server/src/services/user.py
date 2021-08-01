from sqlalchemy import and_
from ..models import User
from ..database import session_scope
from datetime import datetime
from .helper import Result


def post_user(id, password, ip):
    """ create """
    with session_scope() as session:
        try:
            if session.query(User.id).filter(User.id == id).first() != None:
                return Result(False, 'Duplicated ID')

            elif session.query(User.ip).filter(User.ip == ip).first() != None:
                return Result(False, 'Maxmum number of ID that can be created is 1')

            else:
                user = User(id, password, datetime.now(), ip)
                session.add(user)

                return Result(True, 'Create success')

        except:
            return Result(False, 'Database error')


def put_user(id, password):
    """ update """
    with session_scope() as session:
        try:
            user = session.query(User).filter(User.id == id).first()

            if user == None:
                return Result(False, 'Not exist ID')

            else:
                user.password = password

                return Result(True,  'Update success')

        except:
            return Result(False, 'Database error')


def delete_user(id):
    """ delete """
    with session_scope() as session:
        try:
            user = session.query(User).filter(User.id == id).first()

            if user == None:
                return Result(False, 'Not exist ID')

            else:
                session.delete(user)

                return Result(True, 'Delete success')

        except:
            return Result(False, 'Database error')


def login_user(id, password):
    """ login """
    with session_scope() as session:
        try:
            user = session.query(User).filter(
                and_(User.id == id, User.password == password)).first()

            if not user is None:
                return Result(True, 'Login success', {'userID': id})

            else:
                return Result(False, 'No matching data')

        except:
            return Result(False, 'Database error')
