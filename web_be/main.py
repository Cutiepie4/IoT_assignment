from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from bson.objectid import ObjectId
from flask_socketio import SocketIO
from flask_jwt_extended import jwt_required, JWTManager, get_jwt_identity, create_access_token
from datetime import datetime
import uuid, json, os

client = MongoClient('mongodb://localhost:27017')
db = client['iot_db']
books_collection = db['books']
app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = 'nhom10'
jwt = JWTManager(app)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")
UPLOAD_FOLDER = 'C://Users//trvie//Documents//Code//iot//web_fe//public//images//'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

esp32_host = 'http://192.168.0.104'

def find_by_copy_id(id_copy):
    result = books_collection.aggregate([
        {
            "$unwind": "$copies"
        },
        {
            "$match": {
                "copies.copy_id": id_copy
            }
        },
        {
            "$project": {
                "_id": 1,
                "title": 1,
                "author": 1,
                "description": 1,
                "genre": 1,
                "page": 1,
                "copy_id": "$copies.copy_id"  # Thêm trường copy_id
            }
        }
    ])
    
    if result:
        book_data = list(result)[0]
        book_data['_id'] = str(book_data['_id'])
        return book_data
    else:
        return None
    
def find_by_book_id(id):
    book_data = list(books_collection.find({'_id' : ObjectId(id)}))[0]
    book_data['_id'] = str(book_data['_id'])
    return book_data

def delete_image(image_path):
    try:
        if os.path.exists(image_path):
            os.remove(image_path)
            return True
        else:
            print("File does not exist")
            return False
    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return False

# Route
@app.route('/add-book', methods=['POST'])
def add_book():
    image = request.files.get('image')
    book = json.loads(request.form.get('book'))
    filename = str(uuid.uuid4()) + os.path.splitext(image.filename)[-1].lower()
    image.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))

    book["copies"] = []
    book["imagePath"] = filename
    books_collection.insert_one(book)
    return jsonify({"message": "Book added successfully!"}), 200

@app.route('/update-book', methods=['PUT'])
def update_book():
    image = request.files.get('image')
    filename = str(uuid.uuid4()) + os.path.splitext(image.filename)[-1].lower()
    image.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))

    book = json.loads(request.form.get('book'))
    book['imagePath'] = filename
    old_book = find_by_book_id(book['_id'])
    if 'imagePath' in old_book:
        delete_image(UPLOAD_FOLDER + old_book['imagePath'])
    id = ObjectId(book['_id'])
    book.pop('_id', None)
    books_collection.update_one({'_id': id}, {"$set": book})
    return jsonify({'message' : "Update book successfully."}), 200

@app.route('/add-copy', methods=['POST'])
def add_copy():
    data = request.get_json()
    book_id = data['book_id']
    copy_ids = list(data['copy_id'])

    current_time = datetime.now()
    copies = [{"copy_id": i['card_id'], "date_imported": current_time} for i in copy_ids]

    books_collection.update_one(
        {"_id": ObjectId(book_id)},
        {"$addToSet": {"copies": {"$each": copies}}}
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
def find_by_book_id_route(id):
    return jsonify(find_by_book_id(id)), 200

@app.route('/find-copies/<string:id>')
def find_copies(id):
    book_data = list(books_collection.find({'_id' : ObjectId(id)}))[0]
    return jsonify(book_data['copies']), 200

@app.route('/receive-card', methods=['POST'])
def receive_card_id():
    card = request.get_json()
    book = find_by_copy_id(card['card_id'])
    print(book)
    if book != None:
        socketio.emit('add-to-cart', book)
    socketio.emit('add-copy', card)
    return 'Card ID received successfully', 200

@app.route('/upload', methods=['POST'])
def upload_image():
    if 'image' not in request.files:
        return jsonify({'error': 'Không có tệp hình ảnh nào được gửi lên'}), 400
    image = request.files['image']
    if image:
        image.save(os.path.join(app.config['UPLOAD_FOLDER'], image.filename))
        return jsonify({'message': 'Tệp hình ảnh đã được tải lên thành công'}), 200















@app.route('/clear')
def clear_card_id():
    import requests
    requests.get(esp32_host + '/clear')
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