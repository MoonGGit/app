import sqlalchemy
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

# todo : SSL 원격접속 추가, 내부 포트변경
DRIVER = 'mysql+pymysql'
USER = 'myapp'
PASSWORD = os.environ['myapp_password']
HOST = 'myapp:' + os.environ['db_port2']
DATABASE_NAME = 'myapp'
SQLALCHEMY_DATABASE_URL = f'{DRIVER}://{USER}:{PASSWORD}@{HOST}/{DATABASE_NAME}?charset=utf8'

engine = create_engine(SQLALCHEMY_DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()
Base: sqlalchemy.schema.Table
