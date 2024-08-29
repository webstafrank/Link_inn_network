from app import db
from flask_login import UserMixin

class User(db.Model, UserMixin):
        id = db.Column(db.Integer, primary_key=True)
            phone_number = db.Column(db.String(20), unique=True, nullable=False)
                password_hash = db.Column(db.String(128), nullable=False)
                    is_verified = db.Column(db.Boolean, default=False)

                        # Relationships
                            packages = db.relationship('Package', backref='user', lazy=True)
                                posts = db.relationship('BlogPost', backref='author', lazy=True)

