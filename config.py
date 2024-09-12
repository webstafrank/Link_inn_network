import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'supersecretkey'
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'sqlite:///site.db'

    # Quikk.dev API credentials
    QUIKK_DEV_API_KEY = os.environ.get('QUIKK_DEV_API_KEY')
    QUIKK_DEV_API_SECRET = os.environ.get('QUIKK_DEV_API_SECRET')

    QUIKK_PROD_API_KEY = os.environ.get('QUIKK_PROD_API_KEY')
    QUIKK_PROD_API_SECRET = os.environ.get('QUIKK_PROD_API_SECRET')

class DevelopmentConfig(Config):
    DEBUG = True
    QUIKK_API_KEY = Config.QUIKK_DEV_API_KEY
    QUIKK_API_SECRET = Config.QUIKK_DEV_API_SECRET

class ProductionConfig(Config):
    DEBUG = False
    QUIKK_API_KEY = Config.QUIKK_PROD_API_KEY
    QUIKK_API_SECRET = Config.QUIKK_PROD_API_SECRET

