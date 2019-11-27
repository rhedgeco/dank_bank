import json
import falcon

from ..param_handler import validate_params
from ..database_manager import get_account_by_id, execute_transfer, get_transfers
from ..authenticator import get_id_from_token


class Transfers:

    @staticmethod
    def on_get(req, resp):
        if not validate_params(req.params, 'authToken', 'account_id'):
            resp.status = falcon.HTTP_BAD_REQUEST
            return

        user_id = get_id_from_token(req.params['authToken'])
        if not user_id:
            resp.status = falcon.HTTP_UNAUTHORIZED
            return

        acc_id = int(req.params['account_id'])
        if acc_id > 0:
            account = get_account_by_id(acc_id)
            if account['user_id'] != user_id:
                resp.status = falcon.HTTP_UNAUTHORIZED
                return

        resp.body = json.dumps(get_transfers(int(user_id), int(acc_id)), ensure_ascii=False)

    @staticmethod
    def on_post(req, resp):
        if not validate_params(req.params, 'authToken', 'from_account_id', 'to_account_id', 'amount'):
            resp.status = falcon.HTTP_BAD_REQUEST
            return

        user_id = get_id_from_token(req.params['authToken'])
        if not user_id:
            resp.status = falcon.HTTP_UNAUTHORIZED
            return

        from_account = get_account_by_id(req.params['from_account_id'])
        to_account = get_account_by_id(req.params['to_account_id'])
        amount = float(req.params['amount'])

        if amount < 0:
            resp.status = falcon.HTTP_UNAUTHORIZED
            return

        if not from_account or not to_account:
            resp.status = falcon.HTTP_BAD_REQUEST
            return

        # if account is not owned by current user, fail
        if from_account['user_id'] != user_id:
            resp.status = falcon.HTTP_UNAUTHORIZED
            return

        # if account balance is not sufficient, fail
        if float(from_account['balance']) < amount:
            resp.status = falcon.HTTP_UNAUTHORIZED
            resp.body = "Insufficient Funds"
            return

        execute_transfer(send_user_id=user_id,
                         send_account_id=from_account['account_id'],
                         receive_user_id=to_account['user_id'],
                         receive_account_id=to_account['account_id'],
                         amount=amount,
                         description="Transfer funds.")
