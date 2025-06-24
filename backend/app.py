import os
import json
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/api/facts", methods=['GET'])
def get_facts():
    try:
        with open('info.json', 'r', encoding='utf-8') as f:
            facts = json.load(f)
        return jsonify(facts)
    except FileNotFoundError:
        return jsonify({"message": "Facts data not found."}), 500

@app.route("/api/vote", methods=['POST'])
def vote():
    data = request.get_json()
    artwork_id = data.get('artworkId')
    choice = data.get('choice')

    try:
        with open('pollResults.json', 'r') as f:
            results = json.load(f)
    except FileNotFoundError:
        results = {}

    artwork_id_str = str(artwork_id)
    if artwork_id_str not in results:
        results[artwork_id_str] = {"Yes": 0, "No": 0}

    results[artwork_id_str][choice] += 1

    with open('pollResults.json', 'w') as f:
        json.dump(results, f, indent=4)

    return jsonify({"message": "Vote recorded!"}), 200

# as a demonstration variant, it does not handle it securely!!
@app.route("/api/login", methods=['POST'])
def login():
    data = request.get_json()

    if not data or not data.get('username') or not data.get('password'):
        return jsonify({"message": "Username and password are required!"}), 400

    username_attempt = data.get('username')
    password_attempt = data.get('password')

    try:
        with open('users.json', 'r') as f:
            users = json.load(f)
    except FileNotFoundError:
        return jsonify({"message": "User database not found."}), 500

    for user in users:
        if user['username'] == username_attempt and user['password'] == password_attempt:
            return jsonify({
                "message": "Login successful!",
                "user": {"username": user['username']}
            }), 200

    return jsonify({"message": "Invalid username or password"}), 401


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8000, debug=True)