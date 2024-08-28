# app/routes/auth_routes.py
from flask import Blueprint, render_template, redirect, url_for, flash, request
from app.models import User, db
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import login_user, logout_user

auth = Blueprint('auth', __name__)

@auth.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        username = request.form.get('username')
        email = request.form.get('email')
        password = request.form.get('password')

        user = User(username=username, email=email, password_hash=generate_password_hash(password))
        db.session.add(user)
        db.session.commit()

        flash('Account created successfully!', 'success')
        return redirect(url_for('auth.login'))

    return render_template('auth.html')

@auth.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')

        user = User.query.filter_by(email=email).first()

        if user and check_password_hash(user.password_hash, password):
            login_user(user)
            return redirect(url_for('dashboard'))

        flash('Login failed. Check your credentials.', 'danger')

    return render_template('auth.html')

@auth.route('/logout')
def logout():
    logout_user()
    return redirect(url_for('auth.login'))

