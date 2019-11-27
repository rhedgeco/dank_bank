import mimetypes
import os
import uuid
import json

import falcon
import msgpack

from ..param_handler import validate_params
from ..database_manager import apply_check, get_account_by_id, get_checks
from ..authenticator import get_id_from_token
from pathlib import Path


class Checks:
    storage_path = './backend/check_images'

    @staticmethod
    def on_get(req, resp):
        if not validate_params(req.params, 'authToken'):
            resp.status = falcon.HTTP_BAD_REQUEST
            return

        user_id = get_id_from_token(req.params['authToken'])
        if not user_id:
            resp.status = falcon.HTTP_UNAUTHORIZED
            return

        checks = get_checks(user_id)
        images = {'images': []}
        for check in checks:
            images['images'].append({'href': check['image_path']})

        resp.body = msgpack.packb(images, use_bin_type=True)
        resp.content_type = falcon.MEDIA_MSGPACK
        resp.status = falcon.HTTP_OK

    def on_post(self, req, resp):
        if not validate_params(req.params, 'authToken', 'account_id', 'image_path', 'check_amount'):
            resp.status = falcon.HTTP_BAD_REQUEST
            return

        user_id = get_id_from_token(req.params['authToken'])
        if not user_id:
            resp.status = falcon.HTTP_UNAUTHORIZED
            return

        if not Path(self.storage_path).exists():
            Path(self.storage_path).mkdir()

        image = req.get_param("image_path")
        ext = req.get_param("image_path").filename  # mimetypes.guess_extension(req.content_type)
        filename = "{uuid}{ext}".format(uuid=uuid.uuid4(), ext=ext)
        image_path = os.path.join(self.storage_path, filename)
        with open(image_path, "wb") as image_file:
            while True:
                chunk = image.file.read(4096)
                image_file.write(chunk)
                if not chunk:
                    break

        account_id = req.params['account_id']
        check_amount = req.params['check_amount']
        account_confirm = get_account_by_id(account_id)
        if not account_confirm['user_id'] == user_id:
            resp.status = falcon.HTTP_UNAUTHORIZED
            return

        apply_check(account_id, image_path, check_amount)
