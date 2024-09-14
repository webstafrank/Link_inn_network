import requests
from flask import render_template, request, redirect, flash, url_for
from app import app, db
from app.models import Package, Transaction
import os

@app.route('/process_payment', methods=['POST'])
def process_payment():
    package_id = request.form['package_id']
    phone_number = request.form['phone_number']
    
    package = Package.query.get(package_id)
    if not package:
        flash('Package not found!', 'danger')
        return redirect(url_for('index'))

    # Quikk.dev Payment API call
    quikk_url = 'https://api.quikk.dev/v1/payment'
    
    payload = {
        "phone_number": phone_number,
        "amount": package.price,
        "description": f"Purchase of {package.name} package",
        "callback_url": url_for('payment_callback', _external=True)
    }

    headers = {
        'Authorization': f'Bearer {app.config["QUIKK_API_KEY"]}',
        'Content-Type': 'application/json'
    }

    response = requests.post(quikk_url, json=payload, headers=headers)

    if response.status_code == 200:
        # Store transaction in database
        transaction = Transaction(
            package_id=package.id,
            phone_number=phone_number,
            status='pending'
        )
        db.session.add(transaction)
        db.session.commit()

        flash('Payment initiated, please complete the payment on your phone.', 'success')
        return redirect(url_for('index'))
    else:
        flash('Payment failed. Please try again.', 'danger')
        return redirect(url_for('index'))

@app.route('/payment/callback', methods=['POST'])
def payment_callback():
    # Quikk.dev sends a callback on successful or failed payments
    data = request.json
    
    transaction_id = data.get('transaction_id')
    status = data.get('status')

    transaction = Transaction.query.filter_by(id=transaction_id).first()
    if transaction:
        transaction.status = status
        db.session.commit()

    return '', 200

