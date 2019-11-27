import json
import falcon

from ..param_handler import validate_params
from ..database_manager import get_user_by_id, create_user, modify_user, check_user_exists
from ..authenticator import get_id_from_token


class UserProfiles:

    # gets the profile info for a given user
    @staticmethod
    def on_get(req, resp):
        if not validate_params(req.params, 'authToken'):
            resp.status = falcon.HTTP_BAD_REQUEST
            return

        user_id = get_id_from_token(req.params['authToken'])
        if not user_id:
            resp.status = falcon.HTTP_UNAUTHORIZED
            return

        user = get_user_by_id(user_id)
        del user['password']
        del user['pin']
        resp.body = json.dumps(user, ensure_ascii=False)

    # adds a new user profile for a given user
    @staticmethod
    def on_post(req, resp):
        if not validate_params(req.params, 'first_name', 'last_name', 'username', 'password', 'email', 'phone_number',
                               'address', 'pin'):
            resp.status = falcon.HTTP_BAD_REQUEST
            return

        first_name = req.params['first_name']
        last_name = req.params['last_name']
        username = req.params['username']
        password = req.params['password']
        email = req.params['email']
        phone_number = req.params['phone_number']
        address = req.params['address']
        pin = req.params['pin']

        if first_name == "" or last_name == "" or username == "" or password == "" or email == "" or pin == "":
            resp.status = falcon.HTTP_BAD_REQUEST
            return

        if not check_user_exists(username):
            create_user(first_name, last_name, username, password, email, phone_number, address, pin)
            return

        resp.status = falcon.HTTP_FORBIDDEN

    # changes profile info for a given user
    @staticmethod
    def on_put(req, resp):
        if not validate_params(req.params, 'authToken'):
            resp.status = falcon.HTTP_BAD_REQUEST
            return

        user_id = get_id_from_token(req.params['authToken'])
        if not user_id:
            resp.status = falcon.HTTP_UNAUTHORIZED
            return

        username = req.params['username'] if 'username' in req.params else None

        if username:
            if check_user_exists(username):
                resp.status = falcon.HTTP_UNAUTHORIZED
                return

        first_name = req.params['first_name'] if 'first_name' in req.params else None
        last_name = req.params['last_name'] if 'last_name' in req.params else None
        password = req.params['password'] if 'password' in req.params else None
        email = req.params['email'] if 'email' in req.params else None
        phone_number = req.params['phone_number'] if 'phone_number' in req.params else None
        address = req.params['address'] if 'address' in req.params else None
        pin = req.params['pin'] if 'pin' in req.params else None

        modify_user(user_id, first_name, last_name, username, password, email, phone_number, address, pin)
