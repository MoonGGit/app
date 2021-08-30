from sqlalchemy import null
from ..db.database import session_scope
from ..db.models import Accessed_Ip
from datetime import datetime

def put_visits(ip):
    with session_scope() as session:
        result = session.query(Accessed_Ip).filter(
            Accessed_Ip.ip == ip).first()

        if result != None:
            result.visits += 1
            result.recent_accessed_date = datetime.now()

        else:
            new_ip = Accessed_Ip(ip, 1, datetime.now())
            session.add(new_ip)


def get_click_counts():
    with session_scope() as session:
        result = session.query(Accessed_Ip.click_counts).all()
        counts = 0

        for tup in result:
            counts += tup[0]

        return counts


def put_click_counts(ip):
    with session_scope() as session:
        result = session.query(Accessed_Ip).filter(
            Accessed_Ip.ip == ip).first()
        result.click_counts += 1
