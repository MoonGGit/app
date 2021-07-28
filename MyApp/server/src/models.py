from sqlalchemy import Column, Integer, String, Boolean, DateTime, null
from sqlalchemy.sql.schema import ForeignKey
from sqlalchemy.orm import backref, relation
from .database import Base


class Accessed_Ip(Base):
    __tablename__ = 'accessed_ip'
    ip = Column(String(15), primary_key=True)
    visits = Column(Integer)
    recent_accessed_date = Column(DateTime)
    banned = Column(Boolean)
    banned_date = Column(DateTime)
    click_counts = Column(Integer)

    def __init__(self, ip, visits, recent_accessed_date, banned, banned_date, click_counts):
        self.ip = ip
        self.visits = visits
        self.recent_accessed_date = recent_accessed_date
        self.banned = banned
        self.banned_date = banned_date
        self.click_counts = click_counts


class User(Base):
    __tablename__ = 'user'
    id = Column(String(20), primary_key=True, nullable=False)
    password = Column(String(20), nullable=False)
    sign_up_date = Column(DateTime)
    ip = Column(String(15))
    banned = Column(Boolean)
    banned_date = Column(DateTime)

    def __init__(self, id, password, sign_up_date, ip, banned=False, banned_date=null()):
        self.id = id
        self.password = password
        self.sign_up_date = sign_up_date
        self.ip = ip
        self.banned = banned
        self.banned_date = banned_date


class Image_Path(Base):
    __tablename__ = 'image_path'
    # no = Column(Integer, autoincrement=True, primary_key=True)
    # foreign key때문에 MyISAM 사용 불가
    fk_user_id = Column(String(15), ForeignKey('user.id'), primary_key=True)
    path = Column(String(100), primary_key=True)
    paths = relation('User', backref=backref('paths'))

    def __init__(self, fk_user_id, path):
        self.fk_user_id = fk_user_id
        self.path = path
