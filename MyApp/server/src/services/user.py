from sqlalchemy import and_, null
from ..db.models import User, User_Other
from ..db.database import session_scope
from datetime import datetime
from .helper import Result


def create_user(user_id, password, nickname, ip):
    with session_scope() as session:
        try:
            if session.query(User.id).filter(User.id == user_id).first() is not None:
                return Result(False, 'Duplicated ID')

            elif session.query(User.ip).filter(User.ip == ip).first() is not None:
                return Result(False, 'Maxmum number of ID that can be created is 1')

            # elif session.query(User_Other).filter(User_Other.nickname == nickname).first() is not None or session.query(User).filter(User.nickname == nickname).first() is not None:
            #     return Result(False, 'Duplicated nickname')

            else:
                user = User(user_id, password, nickname, datetime.now(), ip)
                session.add(user)

                return Result(True, 'Create success')

        except Exception as err:
            return Result(False, 'Database error : ' + err)


def update_user(user_id, new_password):
    with session_scope() as session:
        try:
            user = session.query(User).filter(User.id == user_id).first()

            if user == None:
                return Result(False, 'Not exist ID')

            else:
                user.password = new_password

                return Result(True,  'Update success')

        except:
            return Result(False, 'Database error')


def set_refresh_token(user_id, refresh_token):
    with session_scope() as session:
        try:
            user = session.query(User).filter(User.id == user_id).first()

            if user == None:
                return Result(False, 'Not exist ID')

            else:
                user.refresh_token = refresh_token

                return Result(True,  'Update success')

        except:
            return Result(False, 'Database error')


def delete_refresh_token(user_id):
    with session_scope() as session:
        try:
            user = session.query(User).filter(User.id == user_id).first()

            if user == None:
                return Result(False, 'Not exist ID')

            else:
                user.refresh_token = null()

                return Result(True,  'Delete success')

        except:
            return Result(False, 'Database error')


def delete_user(id):
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


def login_user(user_id, password):
    with session_scope() as session:
        try:
            user = session.query(User).filter(
                and_(User.id == user_id, User.password == password)).first()

            if not user is None:
                return Result(True, 'Login success', {'user_id': user_id, 'nickname': user.nickname})

            else:
                return Result(False, 'No matching data')

        except:
            return Result(False, 'Database error')
