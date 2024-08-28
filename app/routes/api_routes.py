# app/routes/api_routes.py
from flask import Blueprint, jsonify, request
from app.models import Package, BlogPost, Transaction, db

api = Blueprint('api', __name__)

@api.route('/api/packages', methods=['GET'])
def get_packages():
    packages = Package.query.all()
    return jsonify([{"id": p.id, "name": p.name, "speed": p.speed, "price": p.price} for p in packages])

@api.route('/api/purchase', methods=['POST'])
def purchase():
    data = request.get_json()
    # Process the purchase logic here (including payment via Stripe)
    transaction = Transaction(user_id=data['user_id'], package_id=data['package_id'], amount=data['amount'], status='Completed')
    db.session.add(transaction)
    db.session.commit()
    return jsonify({"message": "Transaction successful."})

@api.route('/api/blogs', methods=['GET'])
def get_blogs():
    posts = BlogPost.query.all()
    return jsonify([{"id": p.id, "title": p.title, "content": p.content, "timestamp": p.timestamp} for p in posts])

