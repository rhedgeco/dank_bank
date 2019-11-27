from falcon import testing
from pathlib import Path
import pytest
import os

print('removing existing sqlite database...')
sqlite_db = Path('backend') / 'sqlite' / 'dank_bank.db'
if sqlite_db.exists():
    os.remove(sqlite_db)
assert not sqlite_db.exists()
print('database removed.')

# imports app afterwards because app will create database again
import app
from backend.database_manager import apply_check

global user1
global user2
user1 = {
    u'first_name': u'Ryan',
    u'last_name': u'Hedgecock',
    u'username': u'user1',
    u'password': u'user1pass',
    u'email': u'mymail@mail.co.uk',
    u'phone_number': u'4084206969',
    u'address': u'the addy',
    u'pin': 1234
}
user2 = {
    u'first_name': u'Grace',
    u'last_name': u'Perlcock',
    u'username': u'user2',
    u'password': u'user2pass',
    u'email': u'mymail@mail.co.uk',
    u'phone_number': u'4084206969',
    u'address': u'the addy',
    u'pin': 4321
}


@pytest.fixture()
def client():
    return testing.TestClient(app.create())


def test_create_users(client):
    result1 = client.simulate_post(
        '/api/user_profiles',
        params=user1
    )

    result2 = client.simulate_post(
        '/api/user_profiles',
        params=user2
    )

    assert result1.status == '200 OK'
    assert result2.status == '200 OK'


def test_authentication(client):
    doc = {
        u'username': user1[u'username'],
        u'password': user1[u'password']
    }

    doc2 = {
        u'username': user2[u'username'],
        u'pin': user2[u'pin']
    }

    res1 = client.simulate_get(
        '/api/auth',
        params=doc
    )

    res2 = client.simulate_get(
        '/api/auth',
        params=doc2
    )

    assert res1.status == '200 OK'
    assert res2.status == '200 OK'

    global user1_token
    global user2_token
    user1_token = res1.text
    user2_token = res2.text


def test_get_users(client):
    resp1 = client.simulate_get(
        '/api/user_profiles',
        params={u'authToken': user1_token}
    )

    resp2 = client.simulate_get(
        '/api/user_profiles',
        params={u'authToken': user2_token}
    )

    assert resp1.status == '200 OK'
    assert resp2.status == '200 OK'

    user1_check = user1.copy()
    user2_check = user2.copy()
    del user1_check['password']
    del user1_check['pin']
    del user2_check['password']
    del user2_check['pin']

    user1_out = resp1.json
    user2_out = resp2.json
    del user1_out['id']
    del user2_out['id']
    assert user1_out == user1_check
    assert user2_out == user2_check


def test_change_users(client):
    user1[u'username'] = 'user3'
    user2[u'username'] = 'user4'
    user1_params = user1.copy()
    user2_params = user2.copy()
    user1_params[u'authToken'] = user1_token
    user2_params[u'authToken'] = user2_token

    resp1 = client.simulate_put(
        '/api/user_profiles',
        params=user1_params
    )

    resp2 = client.simulate_put(
        '/api/user_profiles',
        params=user2_params
    )

    assert resp1.status == '200 OK'
    assert resp2.status == '200 OK'


def test_create_accounts(client):
    acc1 = {
        u'authToken': user1_token,
        u'type': 'CHECKING'
    }
    acc2 = {
        u'authToken': user1_token,
        u'type': 'SAVINGS'
    }
    acc3 = {
        u'authToken': user2_token,
        u'type': 'CHECKING'
    }
    acc4 = {
        u'authToken': user2_token,
        u'type': 'SAVINGS'
    }

    resp1 = client.simulate_post('/api/accounts', params=acc1)
    resp2 = client.simulate_post('/api/accounts', params=acc2)
    resp3 = client.simulate_post('/api/accounts', params=acc3)
    resp4 = client.simulate_post('/api/accounts', params=acc4)

    assert resp1.status == '200 OK'
    assert resp2.status == '200 OK'
    assert resp3.status == '200 OK'
    assert resp4.status == '200 OK'


def test_get_accounts(client):
    resp1 = client.simulate_get('/api/accounts', params={u'authToken': user1_token})
    resp2 = client.simulate_get('/api/accounts', params={u'authToken': user2_token})

    assert resp1.status == '200 OK'
    assert resp2.status == '200 OK'

    assert resp1.text != '[]'
    assert resp2.text != '[]'


def test_cash_checks(client):
    check1 = {
        u'authToken': user1_token,
        u'account_id': 2,
        u'image_path': 'checkImage.png',
        u'check_amount': 20000
    }
    check2 = {
        u'authToken': user2_token,
        u'account_id': 4,
        u'image_path': 'checkImage.jpg',
        u'check_amount': 12345.67
    }

    apply_check(check1[u'account_id'], check1[u'image_path'], check1[u'check_amount'])
    apply_check(check2[u'account_id'], check2[u'image_path'], check2[u'check_amount'])
    # resp1 = client.simulate_post('/api/checks', params=check1)
    # resp2 = client.simulate_post('/api/checks', params=check2)

    # assert resp1.status == '200 OK'
    # assert resp2.status == '200 OK'


def test_transfers(client):
    trans1 = {
        u'authToken': user1_token,
        u'from_account_id': 2,
        u'to_account_id': 1,
        u'amount': 5000
    }
    trans2 = {
        u'authToken': user2_token,
        u'from_account_id': 4,
        u'to_account_id': 3,
        u'amount': 1234
    }
    trans3 = {
        u'authToken': user1_token,
        u'from_account_id': 1,
        u'to_account_id': 3,
        u'amount': 2500
    }
    trans4 = {
        u'authToken': user2_token,
        u'from_account_id': 4,
        u'to_account_id': 1,
        u'amount': 123
    }

    resp1 = client.simulate_post('/api/transfers', params=trans1)
    resp2 = client.simulate_post('/api/transfers', params=trans2)
    resp3 = client.simulate_post('/api/transfers', params=trans3)
    resp4 = client.simulate_post('/api/transfers', params=trans4)

    assert resp1.status == '200 OK'
    assert resp2.status == '200 OK'
    assert resp3.status == '200 OK'
    assert resp4.status == '200 OK'


def test_withdraw(client):
    w1 = {
        u'authToken': user1_token,
        u'account_id': 1,
        u'amount': 100
    }

    resp = client.simulate_post('/api/withdraw', params=w1)

    assert resp.status == '200 OK'
