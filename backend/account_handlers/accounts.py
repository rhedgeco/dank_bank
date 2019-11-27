import json
import falcon

from ..param_handler import validate_params
from ..database_manager import get_accounts, create_account
from ..authenticator import get_id_from_token


class Accounts:

    # REST API GET /accounts
    @staticmethod
    def on_get(req, resp):
        if not validate_params(req.params, 'authToken'):
            resp.status = falcon.HTTP_BAD_REQUEST
            return

        user_id = get_id_from_token(req.params['authToken'])
        if not user_id:
            resp.status = falcon.HTTP_UNAUTHORIZED
            return

        resp.body = json.dumps(get_accounts(user_id), ensure_ascii=False)

    # REST API POST /accounts
    @staticmethod
    def on_post(req, resp):
        if not validate_params(req.params, 'authToken', 'type'):
            resp.status = falcon.HTTP_BAD_REQUEST
            return

        user_id = get_id_from_token(req.params['authToken'])
        account_type = req.params['type']
        if not user_id:
            resp.status = falcon.HTTP_UNAUTHORIZED
            return

        initial_balance = 0
        create_account(user_id, account_type, initial_balance)
