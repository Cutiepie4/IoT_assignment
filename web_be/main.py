from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from bson.objectid import ObjectId
from flask_socketio import SocketIO
from flask_jwt_extended import jwt_required, JWTManager, get_jwt_identity, create_access_token

client = MongoClient('mongodb://localhost:27017')
db = client['iot_db']
books_collection = db['books']
app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = 'nhom10'
jwt = JWTManager(app)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

esp32_host = 'http://192.168.0.104'

def find_book_by_copy_id(id_copy):
    result = books_collection.aggregate([
        {
            "$match": {
                "copies": id_copy
            }
        },
        {
            "$project": {
                "_id": 1,  
                "title": 1,
                "author" : 1,
                "description" : 1,
                "genre" : 1,
                "page": 1
            }
        },
        {
            "$addFields": {
                "copy_id": id_copy
            }
        }
    ])
    book_data = list(result)
    if book_data:
        for i in book_data:
            i['_id'] = str(i['_id'])
        return book_data[0]
    else:
        return None

# Route
@app.route('/add-book', methods=['POST'])
def add_book():
    book = request.get_json()
    book["copies"] = []
    result = books_collection.insert_one(book)
    return jsonify({"message": "Book added successfully!"}), 200

@app.route('/update-book', methods=['PUT'])
def update_book():
    book = request.get_json()
    id = ObjectId(book['_id'])
    book.pop('_id', None)
    books_collection.update_one({'_id': id}, {"$set": book})
    return jsonify({'message' : "Update book successfully."}), 200

@app.route('/add-copy', methods=['POST'])
def add_copy():
    data = request.get_json()
    book_id = data['book_id']
    copy_id = list(data['copy_id'])

    list_id = [i['card_id'] for i in copy_id]

    books_collection.update_one(
        {"_id": ObjectId(book_id)},
        {"$addToSet": {"copies": {"$each": list_id}}}
    )
    return jsonify({"message": "Book copy added successfully!"}), 200

@app.route('/delete-copy/<string:id>', methods=['DELETE'])
def delete_by_copy_id(id):
    book_data = list(books_collection.find())
    for book in book_data:
        if 'copies' in book and id in book['copies']:
            books_collection.update_one(
                {"_id": book["_id"]},
                {"$pull": {"copies": id}}
            )
    return jsonify({"message" : "Delete book copy successfully."}), 200

@app.route('/delete-book/<string:id>', methods=['DELETE'])
def delete_by_book_id(id):
    result = books_collection.delete_one({"_id": ObjectId(id)})
    if result.deleted_count == 1:
        return jsonify({"message": "Delete book successfully."}), 200
    return None

@app.route('/find-all-books')
def find_all_books():
    list_books = list(books_collection.find())
    for i in list_books:
        i['_id'] = str(i['_id'])
    return jsonify(list_books), 200

@app.route('/find-by-book-id/<string:id>')
def find_by_book_id(id):
    book_data = list(books_collection.find({'_id' : ObjectId(id)}))[0]
    book_data['_id'] = str(book_data['_id'])
    return jsonify(book_data), 200

@app.route('/find-copies/<string:id>')
def find_copies(id):
    book_data = list(books_collection.find({'_id' : ObjectId(id)}))[0]
    return jsonify(book_data['copies']), 200

@app.route('/receive-card', methods=['POST'])
def receive_card_id():
    card = request.get_json()
    # book = find_book_by_copy_id(card['card_id'])
    socketio.emit('add-copy', card)
    return 'Card ID received successfully', 200

















@app.route('/clear-card')
def clear_card_id():
    import requests
    requests.get(esp32_host + '/clear-card')
    return 'Clear cards!', 200

@app.route('/enable')
def enable_RFID():
    import requests
    requests.get(esp32_host + '/enable')
    return 'Enable RFID!', 200

@app.route('/disable')
def disable_RFID ():
    import requests
    requests.get(esp32_host + '/disable')
    return 'Turn off RFID', 200

# Authentication
@app.route('/login', methods=['POST'])
def login():
    username = request.get_json()['username']
    password = request.get_json()['password']
    
    if username == 'admin' and password == '123':
        access_token = create_access_token(identity=username)
        return jsonify(access_token=access_token), 200
    else:
        return jsonify(message='Invalid credentials'), 401
    
@app.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    current_user = get_jwt_identity()
    return jsonify(logged_in_as=current_user), 200

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', debug=True)