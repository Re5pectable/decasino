from flask import Flask, render_template, request, redirect, session, url_for, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, logout_user, login_required, login_user, current_user
from models import RoulettePrise, RollSeed, User, Wallet
from web3 import Web3
import time, urllib
import os
from random import randint
import hashlib
from eth_account import Account
import secrets


def upload_items_to_db():
    items = []
    for item in os.listdir('static/img/items'):
        items.append(item)

    for i in range(200):
        n = randint(0, len(items)-1)
        name = items[n].replace('.png', '')
        price = name
        name = '$' + name
        link = 'static/img/items/' + price + '.png'
        if price == '10':
            value = 'Low'
        elif price == '25':
            value = 'Medium'
        elif price == '50':
            value = 'High'
        elif price == '100':
            value = 'Extreme'
        prise = RoulettePrise(name=name, link=link, value=value, price=price)
        db.session.add(prise)
        db.session.commit()


def get_winner(length):
    x_winner = 300 + length
    print(x_winner)
    for item in items:
        if item.left < x_winner < item.left + 100:
            print(item.background_color)


def get_roll_distance(iterations):
    return (iterations + 1) / 2 * iterations


def random_color():
    return str('#%02X%02X%02X' % (randint(0, 255), randint(0, 255), randint(0, 255)))


def generate_roulette():
    items = RoulettePrise.query.all()
    ids = ''.join([str(item.id) for item in items])
    hash = hashlib.md5(ids.encode()).hexdigest()
    db.session.add(RollSeed(
        seed=hash,
        initiator='1234'
    ))
    db.session.commit()
    return items


def create_wallet():
    priv = secrets.token_hex(32)
    private_key = "0x" + priv
    acc = Account.from_key(private_key)
    return {'address': acc, 'secret': private_key}


# TODO: сделать проверку на то, что кошелек не меняется. Если видно, что адресс поменялся - кик на аунтификацию
def check_session(address):
    if 'address' in session.keys():
        if session['address'] == address:
            return
    return redirect('/')


app = Flask(__name__)
password = urllib.parse.quote_plus("")
app.config['SQLALCHEMY_DATABASE_URI'] = f'mysql://root:{password}@localhost/nft_roullette'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
# TODO: сгенерировать нормальный секрет, есть на flask-login readthedocs
app.secret_key = '123'

login_manager = LoginManager()
login_manager.init_app(app)


@login_manager.user_loader
def load_user(user_id):
    user = db.session.query(User).get(user_id)
    print(user, 1)
    return user


@app.route('/', methods=['GET'])
def main():
    # print(current_user)
    return render_template("index.html")


@app.route('/login/', methods=['POST'])
def login():
    print(request.form)
    login = request.form['login']
    password = request.form['password']
    print(login, password)
    user = User.query.filter(User.login == login).first()
    if user:
        if password == user.password:
            login_user(user, remember=True)
            return jsonify({'result': 200})
    return jsonify({'result': 401})


@app.route('/logout/', methods=['GET'])
@login_required
def logout():
    logout_user()
    return redirect(url_for('main'))


# TODO: хэширование паролей
@app.route('/register/', methods=['POST'])
def register():
    login = request.form['login']
    if User.query.filter_by(login=login).first():
        return "UNSUCCESSFUL"
    wallet = Wallet()
    db.session.add(wallet)
    db.session.commit()

    user = User(login=login, wallet_id=wallet.id)

    db.session.add(user)
    db.session.commit()
    login_user(user, remember=True)

    return jsonify({'password': user.password})


@app.route("/profile/", methods=['GET'])
@login_required
def profile():
    print(current_user.password)
    return render_template("profile.html", user=current_user)


@app.route("/roulette/")
@login_required
def roulette():
    return render_template('roulette.html', items=generate_roulette())


@app.route('/roll', methods=['POST'])
def roll():
    f = request.get_json()
    txn_info = web3.eth.getTransaction(f['txn_hash'])
    s = time.time()
    rolls = 10
    ids_hash = hashlib.md5(''.join(f['itemsOrder']).encode()).hexdigest()
    last_seed = RollSeed.query.filter_by(initiator=txn_info['from'].lower()).order_by(RollSeed.id.desc()).first()
    if f['address'].lower() == txn_info['from'].lower() \
            and my_address.lower() == txn_info['to'].lower():
        if last_seed.seed == ids_hash:
            # get_winner(get_roll_distance(rolls))
            print(time.time() - s)
            return str(rolls)


my_address = ''

bsc_testnet = 'https://data-seed-prebsc-1-s1.binance.org:8545'
web3 = Web3(Web3.HTTPProvider(bsc_testnet))

db = SQLAlchemy(app=app)
app.run(host="127.0.0.1", port=8000)


# Sh1Too@Cv+5m4
