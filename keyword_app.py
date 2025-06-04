import logging
from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import keyword_video_get
from header_files import api_key  # Assuming api_key is defined here
import mysql.connector
import traceback
from flask import Blueprint

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Create Blueprint for keyword functionality
keyword_bp = Blueprint('keyword', __name__)

# Configure logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s: %(message)s")

# Database connection function
def get_db_connection():
    try:
        conn = mysql.connector.connect(
            host="",
            user="root",
            password="",
            charset="utf8",
            database=""
        )
        conn.autocommit = True
        if conn.is_connected():
            logging.info("✅ Database connected successfully.")
        return conn
    except mysql.connector.Error as err:
        logging.error(f"❌ Database connection error: {err}")
        return None

# Function to search videos via YouTube API
def search_videos(api_key, search_query):
    base_url = "https://www.googleapis.com/youtube/v3/search"
    params = {
        "part": "snippet",
        "q": search_query,
        "type": "video",
        "maxResults": 50,
        "key": api_key
    }

    video_data = []
    next_page_token = None

    try:
        for _ in range(2):  # Two requests to get 100 videos
            if next_page_token:
                params["pageToken"] = next_page_token

            response = requests.get(base_url, params=params)
            response.raise_for_status()
            data = response.json()

            if "items" not in data:
                logging.error(f"❌ YouTube API Error: {data}")
                return []

            for item in data.get("items", []):
                video_id = item["id"]["videoId"]
                video_link = f"https://www.youtube.com/watch?v={video_id}"
                video_info = {
                    "link": video_link,
                    "videoId": video_id,
                    "publishedAt": item["snippet"]["publishedAt"],
                    "channelTitle": item["snippet"]["channelTitle"],
                    "title": item["snippet"]["title"],
                    "description": item["snippet"]["description"],
                    "thumbnail": item["snippet"]["thumbnails"]["high"]["url"]
                }
                video_data.append(video_info)

            next_page_token = data.get("nextPageToken")
            if not next_page_token:
                break

        return video_data

    except Exception as e:
        logging.error(f"❌ Error in search_videos: {e}")
        return []

# Mock ranking functions
def rank_by_views(video_data):
    if not video_data:
        return []
    for video in video_data:
        video["views"] = 1000  # Mock
    return video_data

def rank_by_sentiment(video_data):
    if not video_data:
        return []
    for video in video_data:
        video["sentiment_score"] = 0.75  # Mock
    return video_data

def rank_by_likes(video_data):
    if not video_data:
        return []
    for video in video_data:
        video["likes"] = 1000  # Mock
    return video_data

# Function to combine rankings
def combined_rank(video_data):
    ranked_by_views = rank_by_views(video_data)
    ranked_by_sentiment = rank_by_sentiment(ranked_by_views)
    ranked_by_likes = rank_by_likes(ranked_by_sentiment)

    for video in ranked_by_likes:
        video["combined_score"] = (video["views"] * 0.4) + (video["likes"] * 0.3) + (video["sentiment_score"] * 0.3)

    ranked_by_likes.sort(key=lambda x: x["combined_score"], reverse=True)
    return ranked_by_likes[0] if ranked_by_likes else None

# Function to save search history
def save_search_history(user_id, user_type, search_query, searched_url):
    conn = get_db_connection()
    if not conn:
        logging.error("❌ Failed to connect to database for saving search history.")
        return False
    try:
        cursor = conn.cursor()
        cursor.execute("SET NAMES utf8mb4;")

        if user_type == "student":
            query = "INSERT INTO student_search_history (student_id, search_query, searched_url) VALUES (%s, %s, %s)"
        elif user_type == "teacher":
            query = "INSERT INTO teacher_search_history (teacher_id, search_query, searched_url) VALUES (%s, %s, %s)"
        else:
            logging.error(f"❌ Invalid user type while saving search history: {user_type}")
            return False

        cursor.execute(query, (user_id, search_query, searched_url))
        conn.commit()

        logging.info(f"✅ Search history saved for user_id={user_id}, query='{search_query}'")
        return True
    except mysql.connector.Error as err:
        logging.error(f"❌ Database error saving search history: {err}")
        return False
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()

# Route for handling video search
@keyword_bp.route('/search', methods=['POST'])
def search_videos_api():
    try:
        data = request.get_json()
        keyword = data.get('keyword')
        user_id = data.get('user_id')
        user_type = data.get('user_type')

        if not keyword or not user_id or not user_type:
            return jsonify({"error": "Missing required fields"}), 400

        video_links = search_videos(api_key, keyword)
        if not video_links:
            return jsonify({"error": "No videos found"}), 404

        top_video = combined_rank(video_links)
        if not top_video:
            return jsonify({"error": "No top video found after ranking"}), 404

        # Save search history
        saved = save_search_history(user_id, user_type, keyword, top_video["link"])
        if not saved:
            logging.error("❌ Failed to save search history to database.")

        response_data = {
            "video_link": top_video["link"],
            "title": top_video["title"],
            "description": top_video["description"],
            "thumbnail": top_video["thumbnail"]
        }

        return jsonify(response_data)

    except Exception as e:
        logging.error(f"❌ Search failed: {e}")
        logging.error(traceback.format_exc())
        return jsonify({"error": "Internal server error"}), 500
