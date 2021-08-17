from sqlalchemy import and_, null
from ..db.models import User_Other, User
from ..db.database import session_scope
from datetime import datetime
from .helper import Result


def create_user_other(user_id, oauth, nickname, ip):
    with session_scope() as session:
        try:
            if session.query(User_Other).filter(and_(User_Other.id == user_id, User_Other.oauth == oauth)).first() is not None:
                return Result(False, 'Already signed up ID')

            # elif session.query(User_Other).filter(User_Other.nickname == nickname).first() is not None or session.query(User).filter(User.nickname == nickname).first() is not None:
            #     return Result(False, 'Duplicated nickname')

            else:
                user_other = User_Other(
                    id=user_id, oauth=oauth, nickname=nickname, sign_up_date=datetime.now(), ip=ip)
                session.add(user_other)

                return Result(True, 'Create success')

        except:
            return Result(False, 'Database error')


def set_user_other_refresh_token(user_id, oauth,  refresh_token):
    with session_scope() as session:
        try:
            user_other = session.query(User_Other).filter(and_(
                User_Other.id == user_id, User_Other.oauth == oauth)).first()

            if user_other == None:
                return Result(False, 'Not exist ID')

            else:
                user_other.refresh_token = refresh_token

                return Result(True,  'Update success')

        except:
            return Result(False, 'Database error')


def delete_user_other_refresh_token(user_id, oauth):
    with session_scope() as session:
        try:
            user_other = session.query(User_Other).filter(
                and_(User_Other.id == user_id, User_Other.oauth == oauth)).first()

            if user_other == None:
                return Result(False, 'Not exist ID')

            else:
                user_other.refresh_token = null()

                return Result(True,  'Delete success')

        except:
            return Result(False, 'Database error')


def delete_user_other(user_id, oauth):
    with session_scope() as session:
        try:
            user_other = session.query(User_Other).filter(
                and_(User_Other.id == user_id, User_Other.oauth == oauth)).first()

            if user_other == None:
                return Result(False, 'Not exist ID')

            else:
                session.delete(user_other)

                return Result(True, 'Delete success')

        except:
            return Result(False, 'Database error')


def login_user_other(user_id, oauth):
    with session_scope() as session:
        try:
            user_other = session.query(User_Other).filter(
                and_(User_Other.id == user_id, User_Other.oauth == oauth)).first()

            if not user_other is None:
                return Result(True, 'Login success', {'user_id': user_id, 'nickname': user_other.nickname, 'oauth': oauth})

            else:
                return Result(False, 'No matching data')

        except:
            return Result(False, 'Database error')
