from flask import Flask, request, jsonify
import psycopg2
import hashlib
import jwt
import datetime

app = Flask(__name__)

SECRET_KEY = "mysecret123"

def get_conn():
    return psycopg2.connect(
        host="localhost",
        database="quizdb",
        user="postgres",
        password="password"
    )

def hash_password(pwd):
    return hashlib.sha256(pwd.encode()).hexdigest()

@app.route("/register", methods=["POST"])
def register():
    data = request.json
    username = data["username"]
    pwd = hash_password(data["password"])
    role = data["role"]

    conn = get_conn()
    cur = conn.cursor()
    cur.execute("INSERT INTO login (username, password, role) VALUES (%s, %s, %s)",
                (username, pwd, role))
    conn.commit()
    cur.close()
    conn.close()

    return jsonify({"msg": "user added"})

@app.route("/login", methods=["POST"])
def login():
    data = request.json
    username = data["username"]
    pwd = hash_password(data["password"])

    conn = get_conn()
    cur = conn.cursor()
    cur.execute("SELECT user_id, password FROM login WHERE username=%s", (username,))
    row = cur.fetchone()

    if row is None:
        return jsonify({"error": "user not found"})

    user_id, db_pwd = row

    if pwd != db_pwd:
        return jsonify({"error": "wrong password"})

    token = jwt.encode(
        {"user_id": user_id, "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=1)},
        SECRET_KEY,
        algorithm="HS256"
    )

    if isinstance(token, bytes):
        token = token.decode("utf-8")

    return jsonify({"token": token})

def auth_required(func):
    def wrapper(*args, **kwargs):
        token = request.headers.get("Authorization")

        if not token:
            return jsonify({"error": "no token given"})

        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            request.user_id = payload["user_id"]
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "token expired"})
        except jwt.InvalidTokenError:
            return jsonify({"error": "invalid token"})

        return func(*args, **kwargs)

    wrapper.__name__ = func.__name__
    return wrapper

@app.route("/add_attempt", methods=["POST"])
@auth_required
def add_attempt():
    data = request.json
    quiz_id = data["quiz_id"]
    score = data["score"]

    conn = get_conn()
    cur = conn.cursor()
    cur.execute("INSERT INTO attempts (player_id, quiz_id, score) VALUES (%s, %s, %s)",
                (request.user_id, quiz_id, score))
    conn.commit()
    cur.close()
    conn.close()

    return jsonify({"msg": "attempt saved"})

@app.route("/avg_score", methods=["GET"])
@auth_required
def avg_score():
    conn = get_conn()
    cur = conn.cursor()
    cur.execute("SELECT AVG(score), COUNT(*) FROM attempts WHERE player_id = %s",
                (request.user_id,))
    avg, count_quizzes = cur.fetchone()

    cur.close()
    conn.close()

    return jsonify({
        "player_id": request.user_id,
        "avg_score": float(avg) if avg else 0,
        "quizzes_played": count_quizzes
    })

if __name__ == "__main__":
    app.run(debug=True)
