from app import db

class BlogPost(db.Model):
        id = db.Column(db.Integer, primary_key=True)
            title = db.Column(db.String(200), nullable=False)
                content = db.Column(db.Text, nullable=False)
                    timestamp = db.Column(db.DateTime, default=db.func.now())

                        # Foreign Key
                            author_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

