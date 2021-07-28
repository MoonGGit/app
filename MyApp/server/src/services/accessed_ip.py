from sqlalchemy import update, null
from ..database import session_scope
from ..models import Accessed_Ip
from datetime import datetime


def put_visits(ip):
    with session_scope() as session:
        accessed_ip = session.query(Accessed_Ip).filter(
            Accessed_Ip.ip == ip).first()
        if accessed_ip != None:
            accessed_ip.visits += 1
            accessed_ip.recent_accessed_date = datetime.now()
        else:
            new_ip = Accessed_Ip(ip, 1, datetime.now(), False, null(), 0)
            session.add(new_ip)


def get_click_counts():
    with session_scope() as session:
        return sum(session.query(Accessed_Ip.click_counts).all())


def put_click_counts(ip):
    with session_scope() as session:
        accessed_ip = session.query(Accessed_Ip).filter(
            Accessed_Ip.ip == ip).first()
        accessed_ip.click_counts += 1
