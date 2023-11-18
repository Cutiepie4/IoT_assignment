from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from bson.objectid import ObjectId
from flask_socketio import SocketIO
from flask_jwt_extended import jwt_required, JWTManager, get_jwt_identity, create_access_token
from datetime import datetime
from bson.json_util import dumps
import uuid, json, os

client = MongoClient('mongodb://localhost:27017')
db = client['iot_db']
books_collection = db['books']
users_collection = db['users']
orders_collection = db['orders']

app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = 'nhom10'
jwt = JWTManager(app)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")
UPLOAD_FOLDER = 'C://Users//DELL//Desktop//IoT_assignment//web_fe//public//images//'
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
                "imagePath": 1,
                "price": 1,
                "date": 1,
                "discount": 1,
                "sold": 1,
                "copy_id": "$copies.copy_id"  # Thêm trường copy_id
            }
        }
    ])
    result = list(result)
    if len(result) > 0:
        book_data = result[0]
        book_data['_id'] = str(book_data['_id'])
        return book_data
    else:
        return None
    
def validateCard(cardId):
    user = find_by_member_id(cardId)
    if user:
        return False
    book = find_by_copy_id(cardId)
    if book:
        return False
    return True
    
def check_book_title_exists(book_title, current_id='default'):
    if current_id == 'default':
        query = {"title": book_title}
    else:
        query = {"title": book_title, "_id": {"$ne": ObjectId(current_id)}}

    book = books_collection.find_one(query)
    return book is not None

def find_by_book_id(id):
    book_data = books_collection.find_one({'_id': ObjectId(id)})
    if not book_data:
        return None
    book_data['_id'] = str(book_data['_id'])
    ratings = book_data.get('ratings', [])
    comments = book_data.get('comments', [])
    user_ratings = {rating['user']: rating['rating'] for rating in ratings}
    num_ratings = len(ratings)
    total_ratings = sum(rating['rating'] for rating in ratings) if num_ratings > 0 else 0

    if num_ratings > 0:
        book_data['overall_rating'] = total_ratings / num_ratings
    else:
        book_data['overall_rating'] = 0.0
    book_data['num_ratings'] = num_ratings

    for comment in comments:
        if 'timestamp' in comment:
            comment['timestamp'] = {"$gte": comment['timestamp']}
        user_username = comment.get('user', None)
        if user_username in user_ratings:
            comment['rating'] = user_ratings[user_username]
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

#==================================================================
# Route
@app.route('/add-book', methods=['POST'])
def add_book():
    image = request.files.get('image')
    book = json.loads(request.form.get('book'))
    if check_book_title_exists(book['title']):
        return jsonify({"message": "Book title already exists!"}), 400
    else:
        filename = str(uuid.uuid4()) + os.path.splitext(image.filename)[-1].lower()
        image.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))

        book["copies"] = []
        book["comments"] = []
        book["imagePath"] = filename
        book["price"] = int(book["price"])
        book["discount"] = int(book["discount"])
        books_collection.insert_one(book)
        return jsonify({"message": "Book added successfully!"}), 200

@app.route('/update-book', methods=['PUT'])
def update_book():
    book = json.loads(request.form.get('book'))
    
    if check_book_title_exists(book['title'], book['_id']):
        return jsonify({'message': 'Cannot edit an existing book title!'}), 400
    else:
        book["price"] = int(book["price"])
        book["discount"] = int(book["discount"])
        old_book = find_by_book_id(book['_id'])
        image = request.files.get('image')

        if image:
            filename = str(uuid.uuid4()) + os.path.splitext(image.filename)[-1].lower()
            image.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            book['imagePath'] = filename
            if 'imagePath' in old_book:
                delete_image(UPLOAD_FOLDER + old_book['imagePath'])
        else:
            book['imagePath'] = old_book['imagePath']

        id = ObjectId(book['_id'])
        book.pop('_id', None)
        books_collection.update_one({'_id': id}, {"$set": book})
        return jsonify({'message' : "Update book successfully."}), 200

@app.route('/add-copy', methods=['POST'])
def add_copy():
    data = request.get_json()
    book_id = data['book_id']
    copy_ids = data['copy_id']
    current_time = datetime.now()
    copy_ids = [copy['card_id'] for copy in copy_ids]
    copies = [{"copy_id": copy_id, "date_imported": current_time} for copy_id in copy_ids]

    query = {
        "copies": {"$elemMatch": {"copy_id": {"$in": copy_ids}}}
    }

    matching_books = books_collection.find(query)
    matching_copy_ids = set()
    for book in matching_books:
        for copy in book['copies']:
            if copy['copy_id'] in copy_ids:
                matching_copy_ids.add(copy['copy_id'])

    if matching_copy_ids:
        return jsonify({"message": f"The following card id are already in the database, please check back: {matching_copy_ids}"}), 400
    else:
        books_collection.update_one(
            {"_id": ObjectId(book_id)},
            {"$addToSet": {"copies": {"$each": copies}}}
        )
        return jsonify({"message": "Book copy added successfully!"}), 200

@app.route('/delete-copy/<string:id>', methods=['DELETE'])
def delete_by_copy_id(id):
    try:
        books_collection.update_many(
            {"copies.copy_id": id},
            {"$pull": {"copies": {"copy_id": id}}}
        )
        return jsonify({"message": f"Deleted the copy successfully."}), 200
    except Exception as e:
        return jsonify({"message": "An error occurred while deleting the copies."}), 500

@app.route('/delete-book/<string:id>', methods=['DELETE'])
def delete_by_book_id(id):
    book = find_by_book_id(id)
    delete_image(UPLOAD_FOLDER + book['imagePath'])
    books_collection.delete_one({"_id": ObjectId(id)})
    return jsonify({"message": "Delete book successfully."}), 200

@app.route('/find-all-books')
def find_all_books():
    list_books = list(books_collection.find())
    for book in list_books:
        book['_id'] = str(book['_id'])
        book['in_stock'] = len(book.get('copies', []))
        if 'comments' in book:
            for comment in book['comments']:
                comment['timestamp'] = {"$gte": comment['timestamp']}
                user_username = comment.get('user', None)
                if user_username:
                    ratings = [rating for rating in book.get('ratings', []) if rating['user'] == user_username]
                    if ratings:
                        comment['rating'] = ratings[0]['rating']
        ratings = book.get('ratings', [])
        num_ratings = len(ratings)
        total_ratings = sum(rating['rating'] for rating in ratings) if num_ratings > 0 else 0
        overall_rating = total_ratings / num_ratings if num_ratings > 0 else 0.0
        
        book['num_ratings'] = num_ratings
        book['overall_rating'] = overall_rating
    return jsonify(list_books), 200

@app.route('/find-by-book-id/<string:id>')
def find_by_book_id_route(id):
    return jsonify(find_by_book_id(id)), 200

@app.route('/find-copies/<string:id>')
def find_copies(id):
    book_data = books_collection.find_one({'_id' : ObjectId(id)})
    return jsonify(book_data['copies']), 200

#============================================================
@app.route('/read-card', methods=['POST'])
def read_rfid_card():
    card = request.get_json()
    book = find_by_copy_id(card['card_id'])
    if book != None:
        new_book = dict()
        new_book['book'] = book;
        new_book['copy_id'] = card['card_id']
        socketio.emit('checkout', new_book)
    else:
        user = find_by_member_id(card['card_id'])
        if user != None:
            socketio.emit('checkout-user', user)
        else: 
            socketio.emit('checkout', {})
    
    
    if validateCard(card['card_id']):
        socketio.emit('sign-up', card)
        socketio.emit('import', card)
    else:
        socketio.emit('sign-up', {})
        socketio.emit('import', {})
    
    return jsonify('Card ID received successfully'), 200

#===============================================================

@app.route('/orders/<string:order_id>')
def find_order_by_id(order_id):
    order = orders_collection.find_one({'_id': ObjectId(order_id)})
    if order:
        order['_id'] = str(order['_id']);
        order['user'] = find_by_member_id(order['user']);
        for item in order['orderItems']:
            book = find_by_book_id(item['book']['_id']);
            if book:
                item['book'] = book;
        return jsonify(order), 200
    else:
        return jsonify({'message': 'Order not found'}), 404
    
@app.route('/orders/user')
@jwt_required()
def find_orders_by_member_id():
    data = get_jwt_identity()
    if not data:
        return jsonify({'message': 'Cannot retrieve data.'}), 404
    user = users_collection.find_one({'username': data['username']})
    orders_cursor = orders_collection.find({'user': user['member_id']})
    orders_list = []
    for order in orders_cursor:
        order['_id'] = str(order['_id'])
        orders_list.append(order)
    return jsonify(orders_list), 200

@app.route('/checkout', methods=['POST'])
def checkout():
    data = request.get_json()

    if 'member_id' in data['user']:
        user_id = data['user']['member_id']
    else:
        user_id = None

    items = data['orderItems']
    current_time = datetime.now()

    new_items = []

    for item in items:
        book_id = item['book']['_id']
        copy_ids = item['copy_ids']

        books_collection.update_one(
            {'_id': ObjectId(book_id)},
            {'$pull': {'copies': {'copy_id': {'$in': copy_ids}}}}
        )

        book = find_by_book_id(book_id)
        new_items.append({'book': book, 'copy_ids': copy_ids})

    orders_collection.insert_one({
        'user': user_id,
        'orderItems': new_items,
        'timestamp': current_time,
        'original_cost': data['original_cost'],
        'discount_cost': data['discount_cost']
    })

    return jsonify('Checkout Success!'), 201

@app.route('/find-all-orders')
def find_all_orders():
    orders = list(orders_collection.find())
    for order in orders:
        order['timestamp'] = {"$gte": order['timestamp']}
        order['_id'] = str(order['_id'])
        updated_order_items = []

        for item in order['orderItems']:
            book_id = item['book']['_id']
            book_details = find_by_book_id(book_id)
            if 'copies' in book_details:
                del book_details['copies']
            if 'comments' in book_details:
                del book_details['comments']
            if 'ratings' in book_details:
                del book_details['ratings']
            quantity = len(item['copy_ids'])
            updated_order_items.append({'book': book_details, 'quantity': quantity, 'copy_ids': item['copy_ids']})

        order['orderItems'] = updated_order_items

        if order['user']:
            order['user'] = find_by_member_id(order['user'])

    return jsonify(orders), 200



# ===============================================================
@app.route('/add-comment/<string:book_id>', methods=['POST'])
@jwt_required()
def add_comment(book_id):
    current_user = get_jwt_identity()
    comment_data = request.get_json()
    book = find_by_book_id(book_id)
    if not book:
        return jsonify({"message": "Books do not exist!"}), 404
    comment_id = str(uuid.uuid4())
    new_comment = {
        "comment_id": comment_id,
        "user": current_user['username'],
        "comment": comment_data['comment'],
        "timestamp": datetime.now()
    }
    books_collection.update_one({"_id": ObjectId(book_id)}, {"$push": {"comments": new_comment}})
    new_comment['timestamp'] = {"$gte": new_comment['timestamp']}
    return jsonify({"message": "Your comment is uploaded.", "comment": new_comment}), 201

@app.route('/delete-comment/<string:book_id>/<string:comment_id>', methods=['DELETE'])
@jwt_required()
def delete_comment(book_id, comment_id):
    current_user = get_jwt_identity()
    book = find_by_book_id(book_id)
    if not book:
        return jsonify({"message": "Books do not exist!"}), 404

    for comment in book['comments']:
        if comment['comment_id'] == comment_id:
            if comment['user'] == current_user['username']:
                books_collection.update_one({"_id": ObjectId(book_id)}, {"$pull": {"comments": {"comment_id": comment_id}}})
                return jsonify({"message": "Comment has been deleted"}), 200
            else:
                return jsonify({"message": "You do not have the right to delete other people's comments"}), 403

    return jsonify({"message": "Comments do not exist"}), 404

# ===============================================================
@app.route('/rating/<string:book_id>', methods=['POST'])
@jwt_required()
def rating(book_id):
    current_user = get_jwt_identity()
    user_rating = request.get_json()['rating']
    
    if not user_rating or user_rating < 1 or user_rating > 5:
        return jsonify({"message": "Invalid rating value. Rating must be between 1 and 5."}), 400

    book = find_by_book_id(book_id)
    if not book:
        return jsonify({"message": "Book does not exist!"}), 404

    existing_rating = next((rating for rating in book.get('ratings', []) if rating['user'] == current_user['username']), None)

    if existing_rating:
        existing_rating['rating'] = user_rating
        existing_rating['timestamp'] = datetime.now()
        books_collection.update_one({"_id": ObjectId(book_id), "ratings.user": current_user['username']}, {"$set": {"ratings.$": existing_rating}})
    else:
        new_rating = {
            "user": current_user['username'],
            "rating": user_rating,
            "timestamp": datetime.now()
        }
        books_collection.update_one({"_id": ObjectId(book_id)}, {"$push": {"ratings": new_rating}})

    return jsonify({"message": "Your rating is submitted."}), 201

@app.route('/rating/<string:book_id>/user', methods=['GET'])
@jwt_required()
def get_user_rating(book_id):
    current_user = get_jwt_identity()

    if not current_user:
        return jsonify({"message": "Invalid user"}), 401

    book = find_by_book_id(book_id)
    if not book:
        return jsonify({"message": "Book does not exist!"}), 404

    ratings = book.get('ratings', [])
    user_rating = next((rating for rating in ratings if rating['user'] == current_user['username']), None)
    if user_rating:
        return jsonify({"user_rating": user_rating['rating']}), 200
    else:
        return jsonify({"message": "User has not rated this book yet."}), 404

# ===============================================================
@app.route('/enable_single_mode')
def enable_RFID_single():
    import requests
    requests.get(esp32_host + '/enable_single_mode')
    return 'Enable RFID Single mode!', 200

@app.route('/enable_continuous_mode')
def enable_RFID_continous():
    import requests
    requests.get(esp32_host + '/enable_continuous_mode')
    return 'Enable RFID Continuous mode!', 200

@app.route('/disable_continuous_mode')
def disable_RFID_continous():
    import requests
    requests.get(esp32_host + '/disable_continuous_mode')
    return 'Turn off RFID Continuous mode', 200

#===================================================================
# Authentication
@app.route('/login', methods=['POST'])
def login():
    username = request.get_json()['username']
    password = request.get_json()['password']
    user = users_collection.find_one({"username": username, "password": password})
    
    if user:
        user_info = {
            'username': username,
            'role': user['role']
        }
        access_token = create_access_token(identity=user_info)
        return jsonify({"access_token": access_token}), 200
    else:
        return jsonify({'message': 'Invalid credentials'}), 401

def find_by_member_id(member_id):
    user = users_collection.find_one({"member_id": member_id})
    if user:
        user["_id"] = str(user["_id"])
        return user
    else:
        return None

@app.route('/find-all-users')
def find_all_users():
    list_users = list(users_collection.find())
    for i in list_users:
        i['_id'] = str(i['_id'])
    return jsonify(list_users), 200

@app.route('/create-user', methods=['POST'])
def create_user():
    data = request.get_json()
    if 'member_id' in data and not validateCard(data['member_id']):
        return jsonify({"message": "Cannot use this card."})
    
    customer_data = {
        "name": data['name'],
        "username": data['username'],
        "phone_number": data['phone_number'],
        "password": data['password'],
        "role": data['role'],
        "date_created": str(datetime.now().date()),
        "status": "active"
    }
    if 'member_id' in data:
        customer_data['member_id'] = data['member_id']
    else:
        customer_data['member_id'] = None

    result = users_collection.insert_one(customer_data)
    return jsonify({"message": "User created successfully!", "customer_id": str(result.inserted_id)}), 201

@app.route('/find-user/<string:user_id>')
def find_user(user_id):
    user = users_collection.find_one({"_id": ObjectId(user_id)})
    if user:
        user['_id'] = str(user['_id'])
        return jsonify(user), 200
    else:
        return jsonify({"message": "User not found"}), 404
    
@app.route('/update-member-id', methods=['POST'])
def update_member_id():
    data = request.get_json()

    user_id = data['userId']
    new_member_id = data['memberId']

    result = users_collection.update_one(
        {'_id': ObjectId(user_id)},
        {'$set': {'member_id': new_member_id}}
    )

    if result.modified_count > 0:
        return jsonify({'message': 'Member ID updated successfully'}), 200
    else:
        return jsonify({'message': 'User not found or no changes made'}), 404

@app.route('/delete-user/<string:id>', methods=['DELETE'])
def delete_user(id):
    result = users_collection.delete_one({"_id": ObjectId(id)})

    if result.deleted_count > 0:
        return jsonify({"message": "User deleted successfully"}), 200
    else:
        return jsonify({"message": "User not found"}), 404

@app.route('/update-user', methods=['PUT'])
def update_user():
    data = request.get_json()
    user_id = data['_id']
    data.pop('_id', None)

    if not data:
        return jsonify({'error': 'No data provided'}), 400

    result = users_collection.update_one(
        {'_id': ObjectId(user_id)},
        {'$set': data}
    )

    if result.matched_count > 0 and result.modified_count > 0:
        return jsonify({'message': 'User updated successfully'}), 200
    else:
        return jsonify({'error': 'User not found or no changes made'}), 404

@app.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    current_user = get_jwt_identity()
    return jsonify(current_user), 200

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', debug=True)