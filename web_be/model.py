from collections import defaultdict
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

def top_5_best_sellers(orders_collection):
    pipeline = [
        {
            "$unwind": "$orderItems"
        },
        {
            "$unwind": "$orderItems.copy_ids"
        },
        {
            "$group": {
                "_id": "$orderItems.book._id",
                "title": {"$first": "$orderItems.book.title"},
                "total_copies_sold": {"$sum": 1}
            }
        },
        {
            "$sort": {"total_copies_sold": -1}
        },
        {
            "$limit": 5
        }
    ]

    result = list(orders_collection.aggregate(pipeline))
    return result

def extract_data(users_collection, books_collection, orders_collection):
    usernames = set(item["username"].lower() for item in users_collection.find())
    book_ids = set(str(item['_id']) for item in books_collection.find())

    user_books = defaultdict(lambda: defaultdict(int))

    for order in orders_collection.find():
        user = order.get("user")
        if user and user.lower() in usernames:
            for order_item in order.get("orderItems", []):
                book_id = str(order_item["book"]["_id"])
                user_books[user.lower()][book_id] += len(order_item.get("copy_ids", []))

    result_df = pd.DataFrame(user_books).fillna(0)

    return result_df


def recommend(data, target_user):
    target_user = target_user.lower()
    df = pd.DataFrame(data)
    
    user_similarity = cosine_similarity(df.T) 

    user_similarity_df = pd.DataFrame(user_similarity, index=df.columns, columns=df.columns)

    similar_users = user_similarity_df[target_user].sort_values(ascending=False)

    recommended_users = similar_users.drop(target_user).index

    recommended_books = df[recommended_users].sum(axis=1)

    top_recommended_books = recommended_books.sort_values(ascending=False)
    recommended_book_ids = np.array(top_recommended_books.index)

    return recommended_book_ids[:5]
