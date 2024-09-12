from flask import render_template, request, redirect, url_for, flash
from app import app, db
from app.models.post import Post
from app.models.comment import Comment
from app.forms.post_form import PostForm

@app.route('/forum', methods=['GET', 'POST'])
def forum():
    form = PostForm()
    posts = Post.query.all()

    if form.validate_on_submit():
        post = Post(title=form.title.data, content=form.content.data)
        db.session.add(post)
        db.session.commit()
        flash('Post created successfully!', 'success')
        return redirect(url_for('forum'))

    return render_template('forum.html', form=form, posts=posts)

@app.route('/post/<int:post_id>', methods=['GET', 'POST'])
def post_detail(post_id):
    post = Post.query.get(post_id)
    comments = Comment.query.filter_by(post_id=post_id).all()
    
    if request.method == 'POST':
        comment_content = request.form['comment']
        comment = Comment(content=comment_content, post_id=post_id)
        db.session.add(comment)
        db.session.commit()
        flash('Comment added!', 'success')
    
    return render_template('post_detail.html', post=post, comments=comments)

