from app import db

class Package(db.Model):
        id = db.Column(db.Integer, primary_key=True)
            name = db.Column(db.String(100), nullable=False)
                speed = db.Column(db.String(50), nullable=False)
                    price = db.Column(db.Float, nullable=False)

                        # Foreign Key
                            user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)

