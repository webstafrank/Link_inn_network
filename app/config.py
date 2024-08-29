import os

class Config:
        SECRET_KEY = os.environ.get('SECRET_KEY') or 'supersecretkey'
            SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'mysql+pymysql://user:password@localhost/linkinn'
                SQLALCHEMY_TRACK_MODIFICATIONS = False

                    # Twilio Config
                        TWILIO_ACCOUNT_SID = os.environ.get('TWILIO_ACCOUNT_SID')
                            TWILIO_AUTH_TOKEN = os.environ.get('TWILIO_AUTH_TOKEN')
                                TWILIO_PHONE_NUMBER = os.environ.get('TWILIO_PHONE_NUMBER')

