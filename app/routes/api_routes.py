from flask import jsonify, request
from app.models.package import Package

@app.route('/api/packages', methods=['GET'])
def get_packages():
    packages = Package.query.all()
    packages_data = [{"id": p.id, "name": p.name, "price": p.price} for p in packages]
    return jsonify(packages_data)


