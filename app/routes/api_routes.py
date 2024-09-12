from flask import render_template
from app.models.package import Package

@app.route('/')
def index():
    packages = Package.query.all()
    return render_template('index.html', packages=packages)

