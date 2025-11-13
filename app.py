from flask import Flask, render_template, request
import psycopg2

app = Flask(__name__)

# Connect to PostgreSQL
conn = psycopg2.connect(
    host="localhost",
    database="quizdb",       
    user="admin",         
    password="dorwssap" 
)

@app.route('/')
def add_user_page():
    return render_template('add_user.html')

@app.route('/add_user', methods=['POST'])
def add_user():
    username = request.form['username']
    password = request.form['password']
    role = request.form['role']

    cur = conn.cursor()
    cur.execute(
        "INSERT INTO login (username, password, role) VALUES (%s, %s, %s)",
        (username, password, role)
    )
    conn.commit()
    cur.close()

    return f"User '{username}' added successfully!"

if __name__ == '__main__':
    app.run(debug=True)
