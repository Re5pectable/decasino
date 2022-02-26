from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin
from eth_account import Account
import secrets

db = SQLAlchemy()


class RoulettePrise(db.Model):
    __tablename__ = 'roulette_prises'
    id = db.Column(db.Integer(), primary_key=True)
    name = db.Column(db.String(256))
    link = db.Column(db.String(128))
    value = db.Column(db.String(24))
    price = db.Column(db.String(16))
    address = db.Column(db.String(128))

    def __init__(self, name=None, link=None, value=None, price=None, address=None):
        self.name = name
        self.link = link
        self.value = value
        self.price = price
        self.address = address


class RollSeed(db.Model):
    __tablename__ = 'roulette_seeds'
    id = db.Column(db.Integer(), primary_key=True)
    seed = db.Column(db.String(32))
    initiator = db.Column(db.String(50))

    def __init__(self, seed=None, initiator=None):
        self.seed = seed
        self.initiator = initiator


class User(db.Model, UserMixin):
    __tablename__ = 'users'
    id = db.Column(db.Integer(), primary_key=True)
    login = db.Column(db.String(24))
    password = db.Column(db.String(24))
    wallet_id = db.Column(db.Integer())

    def __init__(self, login=None, wallet_id=None):
        self.login = login
        self.password = secrets.token_hex(32)
        self.wallet_id = wallet_id


class Wallet(db.Model):
    __tablename__ = 'wallets'
    id = db.Column(db.Integer(), primary_key=True)
    address = db.Column(db.String(50))
    secret = db.Column(db.String(100))

    def __init__(self):
        self.secret = "0x" + secrets.token_hex(32)
        self.address = Account.from_key(self.secret).address