import falcon
import jwt

from datetime import datetime, timedelta

from .param_handler import validate_params, validate_one
from .database_manager import get_user, get_user_with_pin

secret_key = "SJSUSoftwareEngineering"
uptime = 99999  # TODO: update to a reasonable expiration delta


def get_id_from_token(token):
    try:
        cred = jwt.decode(token, secret_key, algorithms=['HS256'])
    except jwt.exceptions.DecodeError:
        return None
    expire = datetime.strptime(cred['expire'], "%d/%m/%Y %H:%M:%S")
    if expire > datetime.now():
        return cred['id']
    return None


def create_token(username: str, password: str = None, pin: int = None):
    user = None
    if password:
        user = get_user(username, password)
    elif pin:
        user = get_user_with_pin(username, pin)
    if not user:
        return None

    cred = {
        'id': user['id'],
        'expire': (datetime.now() + timedelta(minutes=uptime)).strftime("%d/%m/%Y %H:%M:%S")
    }

    return jwt.encode(cred, secret_key, algorithm='HS256')


class Authenticator:

    @staticmethod
    def on_get(req, resp):
        if not validate_params(req.params, 'username') and not validate_one(req.params, 'password', 'pin'):
            resp.status = falcon.HTTP_BAD_REQUEST
            return

        username = req.params['username']
        token = None
        if 'password' in req.params:
            token = create_token(username=username, password=req.params['password'])
        if 'pin' in req.params:
            token = create_token(username=username, pin=int(req.params['pin']))


        if not token:
            resp.status = falcon.HTTP_BAD_REQUEST
            return

        resp.body = token
