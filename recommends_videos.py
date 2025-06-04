from flask import Flask, request, jsonify
import mysql.connector
import requests
from header_files import api_key
from flask import Blueprint
from flask_cors import CORS



app = Flask(__name__)
CORS(app)
YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3/search'

recommends_videos_bp = Blueprint('recommends_videos', __name__)

# Replace with your DB credentials
db_config = {
    'host': 'localhost',
    'user': 'root',
    'password': '',
    'database': ''
}

# Helper function to fetch the latest 5 search queries from the correct table
def fetch_user_search_history(user_id, user_type):
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()

        if user_type == "teacher":
            query = """
                SELECT search_query 
                FROM teacher_search_history 
                WHERE teacher_id = %s 
                ORDER BY id DESC 
                LIMIT 5
            """
        elif user_type == "student":
            query = """
                SELECT search_query 
                FROM student_search_history 
                WHERE student_id = %s 
                ORDER BY id DESC 
                LIMIT 5
            """
        else:
            return None

        cursor.execute(query, (user_id,))
        rows = cursor.fetchall()
        cursor.close()
        conn.close()

        return [row[0] for row in rows] if rows else []
    except mysql.connector.Error as err:
        print(f"Database error: {err}")
        return None

# Function to fetch video recommendations from YouTube API
def get_video_recommendations(search_history):
    if not search_history:
        return [{"error": "No previous searches found."}]

    search_query = " ".join(search_history)
    params = {
        'part': 'snippet',
        'q': search_query,
        'key': api_key,
        'type': 'video',
        'maxResults': 7
    }

    response = requests.get(YOUTUBE_API_URL, params=params)

    if response.status_code == 200:
        data = response.json()
        return [
            {
                'title': item['snippet']['title'],
                'url': f"https://www.youtube.com/watch?v={item['id']['videoId']}",
                'description': item['snippet']['description'],
                'thumbnail': item['snippet']['thumbnails']['high']['url']
            }
            for item in data['items']
        ]
    else:
        return [{"error": "Failed to retrieve videos from YouTube API."}]

# Route to get recommendations
@recommends_videos_bp.route('/recommendations', methods=['GET'])
def get_recommendations():
    user_id = request.args.get('user_id')
    user_type = request.args.get('user_type')  # "student" or "teacher"

    if not user_id or not user_type:
        return jsonify({"error": "Missing 'user_id' or 'user_type' in query parameters."}), 400

    # Fetch user search history from DB
    history = fetch_user_search_history(user_id, user_type)

    if history is None:
        return jsonify({"error": "Failed to retrieve search history from database."}), 500
    if not history:
        return jsonify({"error": f"No search history found for {user_type} '{user_id}'."}), 404

    # Adjust search history length
    if len(history) > 5:
        history = history[:5]  # Use the most recent 5 searches
    # If less than 5, we'll use whatever is available (already handled by the fetch function)

    recommendations = get_video_recommendations(history)

    return jsonify({
        "user_id": user_id,
        "user_type": user_type,
        "search_history": history,
        "recommendations": recommendations
    })


