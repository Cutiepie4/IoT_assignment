import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

# Tạo dữ liệu mẫu
data = {
    'User1': [5, 4, 0, 0, 1],
    'User2': [0, 5, 4, 0, 2],
    'User3': [2, 0, 1, 5, 0],
    'User4': [0, 3, 0, 4, 5],
    'User5': [4, 0, 2, 0, 3]
}

df = pd.DataFrame(data)

# Tính độ tương tự cosine giữa các người dùng
user_similarity = cosine_similarity(df)

# Tạo DataFrame mới để lưu trữ độ tương tự giữa các người dùng
user_similarity_df = pd.DataFrame(user_similarity, index=df.columns, columns=df.columns)

# Gợi ý sách cho một người dùng (ví dụ, User1)
target_user = 'User1'

# Tìm người dùng có độ tương tự cao nhất với target_user
similar_users = user_similarity_df[target_user].sort_values(ascending=False)

# Lọc ra các người dùng mà target_user chưa mua và sắp xếp theo độ tương tự giảm dần
recommended_users = similar_users.drop(target_user).index

# Tìm các sách mà recommended_users đã mua và target_user chưa mua
recommended_books = df[recommended_users].sum(axis=1)
recommended_books = recommended_books[recommended_books > 0]

# Sắp xếp danh sách các sách gợi ý theo số lần mua giảm dần
top_recommended_books = recommended_books.sort_values(ascending=False)

print(f'Top 3 sách gợi ý cho {target_user}:')
for book, score in top_recommended_books.head(3).items():
    print(f'Sách: {book}, Điểm số: {score}')
