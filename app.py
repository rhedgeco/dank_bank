import falcon
import falcon_cors

from backend.account_handlers.accounts import Accounts
from backend.account_handlers.withdraw import Withdraw
from backend.authenticator import Authenticator
from backend.account_handlers.user_profiles import UserProfiles
from backend.account_handlers.checks import Checks
from backend.account_handlers.transfer import Transfers
from backend.static_server import IndexServer
from falcon_multipart.middleware import MultipartMiddleware

from backend.paths import STATIC_DIR

from wsgiref import simple_server

public_cors = falcon_cors.CORS(allow_all_origins=True,
                               allow_all_headers=True,
                               allow_all_methods=True)

api = application = falcon.API(middleware=[public_cors.middleware, MultipartMiddleware()])

api.add_static_route(prefix="/", directory=str(STATIC_DIR))

index = IndexServer()
api.add_route('/', index)

authenticator = Authenticator()
api.add_route('/api/auth', authenticator)

accounts = Accounts()
api.add_route('/api/accounts', accounts)

user_profiles = UserProfiles()
api.add_route('/api/user_profiles', user_profiles)

checks = Checks()
api.add_route('/api/checks', checks)

transfers = Transfers()
api.add_route('/api/transfers', transfers)

withdraw = Withdraw()
api.add_route('/api/withdraw', withdraw)

if __name__ == "__main__":
    print('only run this file directly for local hosting')
    server = simple_server.make_server(
        host="0.0.0.0",
        port=80,
        app=api
    )

    print(f'Serving webserver at http://{server.server_address[0]}:{server.server_address[1]}')
    server.serve_forever()
