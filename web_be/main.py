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

esp32_host = 'http://192.168.0.105'

headers={
    'Content-type':'application/json', 
    'Accept':'application/json'
}

@app.route('/addcardid', methods=['POST'])
def add_card_id():
    card_id = request.get_json()
    socketio.emit('updatecardid', card_id)
    return jsonify({'message': 'Card ID added successfully'})

# @app.route('/change-color', methods=['POST'])
# def changeColor():
#     color = request.get_json()
#     print(color)
#     return 'ok', 200

# @app.route('/turn-on-led', methods=['POST'])
# def turn_on_led():
#     import requests
#     requests.post('http://192.168.0.103:80/turnonled', request.get_json(), headers=headers)
#     return 'LED turned on', 200

# @app.route('/get-book/<id>')
# def get_book(id):
#     cursor = books_collection.find()
#     book_data = [doc for doc in cursor]
#     for i in book_data:
#         i['_id'] = str(i['_id'])
#     return jsonify(book_data), 200

@app.route('/send-card-id', methods=['POST'])
def receive_card_id():
    data = request.get_json()
    print(data)
    return 'Card ID received successfully', 200

# @app.route('/clear-card')
# def clear_card():
#     import requests
#     requests.get(esp32_host + '/clear-card')
#     return 'Clear cards!', 200

if __name__ == '__main__':
    # app.run(host='0.0.0.0', debug=True)
    socketio.run(app, host='0.0.0.0', debug=True)