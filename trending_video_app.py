from config import api_key
from flask import Flask, jsonify
from flask_cors import CORS
import requests
from flask import Blueprint

# app = Flask(__name__)
# CORS(app)  # Enable CORS
trending_video_bp = Blueprint('trending_video', __name__)
# Replace with your actual YouTube API Key
YOUTUBE_API_KEY = api_key
TRENDING_URL = "https://www.googleapis.com/youtube/v3/videos"
VIDEO_DETAILS_URL = "https://www.googleapis.com/youtube/v3/videos"


@trending_video_bp.route("/trending", methods=["GET"])
def get_trending_videos():
    params = {
        "part": "snippet,statistics,contentDetails",
        "chart": "mostPopular",
        "regionCode": "US",
        "videoCategoryId": "28",  # Tech videos category
        "maxResults": 28,
        "key": YOUTUBE_API_KEY,
    }

    response = requests.get(TRENDING_URL, params=params)

    if response.status_code == 200:
        data = response.json()
        filtered_videos = []

        for video in data.get("items", []):
            duration = video["contentDetails"]["duration"]

            # Exclude Shorts (typically under 1 minute)
            if "PT" in duration and "M" not in duration:
                continue  # Skip short videos (e.g., PT59S, PT45S)

            filtered_videos.append(video)

        return jsonify({"items": filtered_videos})  # Return filtered videos

    else:
        return jsonify({"error": "Failed to fetch trending videos"}), 500


