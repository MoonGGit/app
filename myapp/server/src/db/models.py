from sqlalchemy import Column, Integer, String, Boolean, DateTime, null
from sqlalchemy.sql.schema import CheckConstraint, ForeignKey
from sqlalchemy.orm import backref, relation
from .database import Base


class Accessed_Ip(Base):
    __tablename__ = 'accessed_ip'
    ip = Column(String(15), primary_key=True, nullable=False)
    visits = Column(Integer, nullable=False)
    recent_accessed_date = Column(DateTime, nullable=False)
    banned = Column(Boolean, nullable=False)
    banned_date = Column(DateTime, nullable=True)
    click_counts = Column(Integer, nullable=False)

    def __init__(self, ip, visits, recent_accessed_date, banned=False, banned_date=null(), click_counts=0):
        self.ip = ip
        self.visits = visits
        self.recent_accessed_date = recent_accessed_date
        self.banned = banned
        self.banned_date = banned_date
        self.click_counts = click_counts


class User(Base):
    __tablename__ = 'user'
    id = Column(String(30), primary_key=True, nullable=False)
    password = Column(String(20), nullable=False)
    nickname = Column(String(10), nullable=False)
    sign_up_date = Column(DateTime, nullable=False)
    ip = Column(String(15), nullable=False)
    banned = Column(Boolean, nullable=False)
    banned_date = Column(DateTime, nullable=True)
    refresh_token = Column(String(500), nullable=True)

    def __init__(self, id, password, nickname, sign_up_date, ip, banned=False, banned_date=null(), refresh_token=null()):
        self.id = id
        self.password = password
        self.nickname = nickname
        self.sign_up_date = sign_up_date
        self.ip = ip
        self.banned = banned
        self.banned_date = banned_date
        self.refresh_token = refresh_token


class User_Other(Base):
    __tablename__ = 'user_other'
    fk_user_id = Column(String(30), ForeignKey(
        'user.id', ondelete='CASCADE'), nullable=True)
    id = Column(String(30), primary_key=True, nullable=False, index=True)
    oauth = Column(String(10), primary_key=True, nullable=False, index=True)
    nickname = Column(String(10), nullable=False)
    sign_up_date = Column(DateTime, nullable=False)
    ip = Column(String(15), nullable=False)
    banned = Column(Boolean, nullable=False)
    banned_date = Column(DateTime, nullable=True)
    refresh_token = Column(String(500), nullable=True)

    def __init__(self,  id, oauth, nickname, sign_up_date, ip, fk_user_id=null(), banned=False, banned_date=null(), refresh_token=null()):
        self.fk_user_id = fk_user_id
        self.id = id
        self.oauth = oauth
        self.nickname = nickname
        self.sign_up_date = sign_up_date
        self.ip = ip
        self.banned = banned
        self.banned_date = banned_date
        self.refresh_token = refresh_token


class Local_Db_Path(Base):
    __tablename__ = 'local_db_path'
    fk_user_id = Column(String(30), ForeignKey(
        'user.id'), nullable=True)
    fk_user_other_id = Column(String(30), ForeignKey(
        'user_other.id'), nullable=True)
    fk_user_other_oauth = Column(String(10), ForeignKey(
        'user_other.oauth'), nullable=True)
    no = Column(Integer, primary_key=True, autoincrement=True, nullable=False)
    path = Column(String(100), nullable=False)
    save_date = Column(DateTime, nullable=True)

    user = relation('User', backref=backref('user_paths'))
    user_other = relation(
        'User_Other', foreign_keys=[fk_user_other_id], innerjoin='Local_Db_Path.fk_user_other_oauth == User_Other.oauth',
        backref=backref('user_other_paths'))

    __table_args__ = (
        CheckConstraint(r'''fk_user_id is not null or
        fk_user_other_id is not null and fk_user_other_oauth is not null'''),
    )

    # __mapper_args__ = {'primary_key': [fk_user_id]}

    def __init__(self, fk_user_id, fk_user_other_id, fk_user_other_oauth, path, save_date):
        self.fk_user_id = fk_user_id
        self.fk_user_other_id = fk_user_other_id
        self.fk_user_other_oauth = fk_user_other_oauth
        self.path = path
        self.save_date = save_date
