# app/routes/payment_routes.py
import stripe
from flask import Blueprint, jsonify, request
from app.models import Transaction, db

stripe.api_key = 'your_stripe_secret_key'

payment = Blueprint('payment', __name__)

@payment.route('/api/payment', methods=['POST'])
def process_payment():
    data = request.get_json()
    try:
        charge = stripe.Charge.create(
            amount=int(data['amount'] * 100),  # Amount in cents
            currency='usd',
            description='Internet Package Purchase',
            source=data['token']
        )
        transaction = Transaction(user_id=data['user_id'], package_id=data['package_id'], amount=data['amount'], status='Completed')
        db.session.add(transaction)
        db.session.commit()
        return jsonify({"message": "Payment successful."})
    except stripe.error.StripeError as e:
        return jsonify({"error": str(e)})

