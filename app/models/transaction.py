from app import db

class Transaction(db.Model):
        id = db.Column(db.Integer, primary_key=True)
            amount = db.Column(db.Float, nullable=False)
                status = db.Column(db.String(20), nullable=False)

                    # Foreign Keys
                        user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
                            package_id = db.Column(db.Integer, db.ForeignKey('package.id'), nullable=False)

