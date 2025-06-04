from flask import Flask, request, jsonify, send_from_directory
import mysql.connector
from flask import Blueprint
from flask_cors import CORS
import re
import datetime
import os
import subprocess

app = Flask(__name__)
CORS(app)

find_video_bp = Blueprint('find_video', __name__)
serve_clip_bp = Blueprint('serve_clip', __name__)
CLIP_DIR = "static/clips"

os.makedirs(CLIP_DIR, exist_ok=True)
FFMPEG_PATH = r"C:\Users\AsimPC\desktop\ffmpeg\ffmpeg-2025-05-19-git-c55d65ac0a-full_build\bin\ffmpeg.exe"
ytdlp_path = r"C:\Users\AsimPC\desktop\yt-dlp\yt-dlp.exe"
os.environ["PATH"] += os.pathsep + os.path.dirname(FFMPEG_PATH)
os.environ["PATH"] += os.pathsep + os.path.dirname(ytdlp_path)
def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="",
        charset="utf8",
        database="youtube_search_app"
    )

def format_time_from_timedelta(tdelta):
    if tdelta is None:
        return "00:00:00"
    total_seconds = int(tdelta.total_seconds())
    hours = total_seconds // 3600
    minutes = (total_seconds % 3600) // 60
    seconds = total_seconds % 60
    return f"{hours:02}:{minutes:02}:{seconds:02}"

def time_to_seconds(t):
    if t is None:
        return 0
    if isinstance(t, datetime.time):
        return t.hour * 3600 + t.minute * 60 + t.second
    if isinstance(t, datetime.timedelta):
        return int(t.total_seconds())
    return 0

@find_video_bp.route('/find_video', methods=['GET'])
def find_video():
    course_id = request.args.get('course_id')
    lecture_id = request.args.get('lecture_id')

    if not course_id or not lecture_id:
        return jsonify({"error": "Missing course_id or lecture_id parameter"}), 400

    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        print(f"Received course_id={course_id}, lecture_id={lecture_id}")

        query = """
            SELECT video_title, video_url, start_time, end_time
            FROM video_links
            WHERE course_id = %s AND lecture_id = %s
            LIMIT 1

        """

        
        cursor.execute(query, (course_id, lecture_id))
        result = cursor.fetchone()
        cursor.close()
        conn.close()

        if not result:
            return jsonify({"error": "Video not found"}), 404

        # Extract video ID
        match = re.search(r'(?:v=|youtu\.be/)([^&]+)', result['video_url'])
        if not match:
            return jsonify({"error": "Invalid YouTube URL"}), 400
        video_id = match.group(1)

        # Format times
        start_str = format_time_from_timedelta(result['start_time'])
        end_str = format_time_from_timedelta(result['end_time'])

        clip_filename = f"clip_{course_id}_{lecture_id}.mp4"
        clip_path = os.path.join(CLIP_DIR, clip_filename)
        
        # If not already processed, download and trim
        if not os.path.exists(clip_path):
            full_video_path = os.path.join(CLIP_DIR, f"full_{video_id}.mp4")

            # Download the video (only once)
            if not os.path.exists(full_video_path):
                subprocess.run([
                    ytdlp_path,
                    "-o", full_video_path,
                    f"https://www.youtube.com/watch?v={video_id}"
                ], check=True)

            # Trim the video segment
            subprocess.run([
                FFMPEG_PATH,
                "-i", full_video_path,
                "-ss", start_str,
                "-to", end_str,
                "-c", "copy",
                clip_path
            ], check=True)

        return jsonify({
            "video_url": f"http://localhost:5000/serve_clip/{course_id}/{lecture_id}",
            "intervals": [[start_str, end_str]],
            "concat": True,
            "is_youtube": False
        })

    except mysql.connector.Error as err:
        return jsonify({"error": f"Database error: {err}"}), 500
    except subprocess.CalledProcessError as err:
        return jsonify({"error": f"Video processing failed: {err}"}), 500


@serve_clip_bp.route('/<course_id>/<lecture_id>')
def serve_clip(course_id, lecture_id):
    filename = f"clip_{course_id}_{lecture_id}.mp4"
    return send_from_directory(CLIP_DIR, filename)
