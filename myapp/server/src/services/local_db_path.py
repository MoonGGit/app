from sqlalchemy import null, and_
from ..db.database import session_scope
from ..db.models import Local_Db_Path, User_Other, User
from datetime import datetime
from .helper import Result


def save_path(user_id, oauth, path):
    with session_scope() as session:
        try:
            if oauth is None:
                if 10 <= session.query(Local_Db_Path).filter(Local_Db_Path.fk_user_id == user_id).count():
                    return Result(False, 'maximum number of save Data is 10')

                new_path = Local_Db_Path(
                    user_id, null(), null(), path, datetime.now())
                session.add(new_path)

                return Result(True, 'Save success')

            else:
                user_other = session.query(User_Other).filter(
                    and_(User_Other.id == user_id, User_Other.oauth == oauth)).first()

                if user_other.fk_user_id is not None:
                    if 10 <= session.query(Local_Db_Path).filter(Local_Db_Path.fk_user_id == user_other.fk_user_id).count():
                        return Result(False, 'maximum number of save Data is 10')

                    new_path = Local_Db_Path(
                        null(), user_id, oauth, path, datetime.now())
                    session.add(new_path)

                    return Result(True, 'Save success')

                else:
                    if 10 <= session.query(Local_Db_Path).filter(and_(Local_Db_Path.fk_user_other_id == user_id, Local_Db_Path.fk_user_other_oauth == oauth)).count():
                        return Result(False, 'maximum number of save Data is 10')

                    new_path = Local_Db_Path(
                        user_other.fk_user_id, user_id, oauth, path, datetime.now())
                    session.add(new_path)

                    return Result(True, 'Save success')

        except Exception as err:
            return Result(False, 'Database error : ' + str(err))


def delete_path(user_id, oauth, no_list):
    with session_scope() as session:
        try:
            deleted_paths = []

            path_list = session.query(Local_Db_Path).filter(
                Local_Db_Path.no.in_(no_list)).all()

            for path in path_list:
                if (path.fk_user_id != user_id) and \
                        (path.fk_user_other_id != user_id and path.fk_user_other_oauth != oauth):
                    return Result(False, 'Invalid access', {'deleted_paths': deleted_paths})

                session.delete(path)
                deleted_paths.append(
                    {'no': path.no, 'deleted_path': path.path})

            return Result(True, 'Delete success', {'deleted_paths': deleted_paths})

        except Exception as err:
            return Result(False, 'Database error : ' + str(err))


def get_paths(user_id, oauth):
    with session_scope() as session:
        try:
            if oauth is not None:
                user_other = session.query(User_Other).filter(
                    and_(User_Other.id == user_id, User_Other.oauth == oauth)).first()

                if user_other.fk_user_id is not None:
                    no_list = session.query(Local_Db_Path.no).filter(
                        Local_Db_Path.fk_user_id == user_other.fk_user_id).all()
                    no_list = [_[0] for _ in no_list]

                    return Result(True, 'Get success', {'no_list': no_list})

                else:
                    no_list = session.query(Local_Db_Path.no).filter(and_(
                        Local_Db_Path.fk_user_other_id == user_id, Local_Db_Path.fk_user_other_oauth == oauth)).all()
                    no_list = [_[0] for _ in no_list]

                    return Result(True, 'Get success', {'no_list': no_list})

            else:
                no_list = session.query(Local_Db_Path.no).filter(
                    Local_Db_Path.fk_user_id == user_id).all()
                no_list = [_[0] for _ in no_list]

                return Result(True, 'Get success', {'no_list': no_list})

        except Exception as err:
            return Result(False, 'Database error : ' + str(err))


def get_path(user_id, oauth, no):
    with session_scope() as session:
        try:
            path = session.query(Local_Db_Path).filter(
                Local_Db_Path.no == no).first()

            if (path.fk_user_id != user_id) and \
                    (path.fk_user_other_id != user_id and path.fk_user_other_oauth != oauth):
                return Result(False, 'Invalid access')

            return Result(True, 'Get success', {'path': path.path})

        except Exception as err:
            return Result(False, 'Database error : ' + str(err))
