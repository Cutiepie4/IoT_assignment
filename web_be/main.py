from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from flask_socketio import SocketIO

client = MongoClient('mongodb://localhost:27017')
db = client['iot_db']
books_collection = db['books']
app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

esp32_host = 'http://192.168.0.102'

# @app.route('/get-book/<id>')
# def get_book(id):
#     cursor = books_collection.find()
#     book_data = [doc for doc in cursor]
#     for i in book_data:
#         i['_id'] = str(i['_id'])
#     return jsonify(book_data), 200

@app.route('/receive-card', methods=['POST'])
def receive_card_id():
    card_id = request.get_json()
    print(card_id)
    socketio.emit('add-card', card_id)
    return 'Card ID received successfully', 200

@app.route('/clear-card')
def clear_card_id():
    import requests
    requests.get(esp32_host + '/clear-card')
    return 'Clear cards!', 200

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', debug=True)