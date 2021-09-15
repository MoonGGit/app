from flask import Blueprint, request, jsonify
from .. import TEMPLATE_FORDER_PATH, STATIC_FORDER_PATH, LOCAL_SAVE_DATA_PATH
from ..services.jwt_auth import token_check
import string
import random
import os
from ..services.local_db_path import save_path
from ..services.helper import Result

dots_converter = Blueprint('dots_converter', __name__, url_prefix='/dots-converter')

@dots_converter.route('/archive', methods=['POST'])
@token_check
def dots_converter_archive_add(user_id, oauth, access_token):
    if request.json.get('dotsImageDataURL') is not None \
            and request.json.get('fileName') is not None:
        string_pool = string.ascii_letters + string.digits
        save_dir = LOCAL_SAVE_DATA_PATH + 'dots_converter/'

        if not os.path.exists(save_dir):
            os.makedirs(save_dir)

        while True:
            save_filename = request.json['fileName'] + '.'
            for _ in range(10):
                save_filename += random.choice(string_pool)

            files = os.listdir(save_dir)
            if save_filename in files:
                continue
            else:
                break

        with open(save_dir + save_filename, 'xt') as fout:
            chunk_size = 1000
            offset = 0
            while True:
                if offset > len(request.json['dotsImageDataURL']):
                    break
                fout.write(request.json['dotsImageDataURL']
                           [offset:offset+chunk_size])
                offset += chunk_size

        result = save_path(user_id, oauth, 'dots_converter/' + save_filename)

        if result.success == False:
            if os.path.isfile(save_dir + save_filename):
                os.remove(save_dir + save_filename)

            return jsonify(result.get_dict())

        else:
            response = result.get_dict()

            if access_token is not None:
                response['value'].update({'access_token': access_token})

            return jsonify(response)

    else:
        return jsonify(Result(False, 'Invalid request').get_dict())
