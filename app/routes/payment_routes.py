import requests
from flask import request, jsonify

QUIKK_API_KEY = 'your_quikk_api_key'
QUIKK_API_SECRET = 'your_quikk_api_secret'
QUIKK_BASE_URL = 'https://api.quikk.dev/mpesa/v1'

@app.route('/process_payment', methods=['POST'])
def process_payment():
    package_id = request.form.get('package_id')
    phone_number = request.form.get('phone_number')

    # Fetch package details from DB
    package = Package.query.get(package_id)
    
    url = f'{QUIKK_BASE_URL}/stkpush'
    payload = {
        "phone": phone_number,
        "amount": package.price,
        "reference": "LinkInnInternets",
        "description": f"Payment for {package.name}",
        "callback_url": "https://yourdomain.com/callback"
    }

    headers = {
        "Authorization": f"Bearer {QUIKK_API_KEY}:{QUIKK_API_SECRET}",
        "Content-Type": "application/json"
    }

    response = requests.post(url, json=payload, headers=headers)
    
    if response.status_code == 200:
        return jsonify({"status": "success", "message": "Payment request sent."})
    else:
        return jsonify({"status": "error", "message": "Payment request failed."})

