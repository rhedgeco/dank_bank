import falcon

from ..authenticator import get_id_from_token
from ..param_handler import validate_params
from ..database_manager import withdraw_money, get_account_by_id


class Withdraw:

    @staticmethod
    def on_post(req, resp):
        if not validate_params(req.params, 'authToken', 'account_id', 'amount'):
            resp.status = falcon.HTTP_BAD_REQUEST
            return

        user_id = get_id_from_token(req.params['authToken'])
        if not user_id:
            resp.status = falcon.HTTP_UNAUTHORIZED
            return

        amount = float(req.params['amount'])
        if amount < 0:
            resp.status = falcon.HTTP_UNAUTHORIZED
            return

        from_account = get_account_by_id(req.params['account_id'])

        # if account is not owned by current user, fail
        if from_account['user_id'] != user_id:
            resp.status = falcon.HTTP_UNAUTHORIZED
            return

        # if account balance is not sufficient, fail
        if float(from_account['balance']) < amount:
            resp.status = falcon.HTTP_UNAUTHORIZED
            resp.body = "Insufficient Funds"
            return

        withdraw_money(from_account['account_id'], amount)
