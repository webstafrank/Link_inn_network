# config.py
import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'supersecretkey'
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'mysql://username:password@localhost/linkinn'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    STRIPE_API_KEY = os.environ.get('STRIPE_API_KEY') or 'your_stripe_api_key'

