import sqlalchemy
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from contextlib import contextmanager

# todo : SSL 원격접속 추가, 내부 포트변경
DRIVER = 'mysql+pymysql'
USER = 'myapp'
PASSWORD = os.environ['myapp_password']
HOST = 'myapp_mysql:' + os.environ['mysql_port2']
DATABASE_NAME = 'myapp'
SQLALCHEMY_DATABASE_URL = f'{DRIVER}://{USER}:{PASSWORD}@{HOST}/{DATABASE_NAME}?charset=utf8'

engine = create_engine(SQLALCHEMY_DATABASE_URL)

Session = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@contextmanager
def session_scope():
    session = Session()
    session: sqlalchemy.orm.Session
    try:
        yield session
        session.commit()
    except:
        session.rollback()
        raise
    finally:
        session.close()


Base = declarative_base()
Base: sqlalchemy.schema.Table
