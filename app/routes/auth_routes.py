from flask import render_template, redirect, request, flash, url_for
from app import app, db
from app.forms.auth_forms import SignUpForm, SignInForm
from app.models.user import User

@app.route('/signup', methods=['GET', 'POST'])
def signup():
    form = SignUpForm()
    if form.validate_on_submit():
        user = User(phone_number=form.phone_number.data, name=form.name.data)
        db.session.add(user)
        db.session.commit()
        flash("Account created successfully", "success")
        return redirect(url_for('login'))
    return render_template('auth.html', form=form)

@app.route('/login', methods=['GET', 'POST'])
def login():
    form = SignInForm()
    if form.validate_on_submit():
        user = User.query.filter_by(phone_number=form.phone_number.data).first()
        if user:
            # Assuming password authentication
            return redirect(url_for('dashboard'))
        flash("Invalid login credentials", "danger")
    return render_template('auth.html', form=form)

