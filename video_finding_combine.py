from flask import Flask, request, jsonify
from document_reader import process_document
from final_video_extractor import SemanticTranscriptMatcher, get_db_config
from new_transcript import search_videos_from_keywords
import os
import mysql.connector
from datetime import datetime
import requests
import tempfile
import shutil
from flask import Blueprint
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

video_finding_combine_bp = Blueprint('video_finding_combine', __name__)

# Database configuration (adjust as per your setup)
def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="",
        charset="utf8",
        database="youtube_search_app"
    )



# Function to get lecture file URL from the database
def get_lecture_file_url(course_id, lecture_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        query = """
        SELECT lecture_url, lecture_title
        FROM lecture_files
        WHERE course_id = %s AND lecture_id = %s
        """
        cursor.execute(query, (course_id, lecture_id))
        result = cursor.fetchone()

        cursor.close()
        conn.close()

        if not result:
            raise FileNotFoundError(f"No lecture found for course_id={course_id}, lecture_id={lecture_id}")
        
        return result['lecture_url'], result['lecture_title']
    except mysql.connector.Error as e:
        raise Exception(f"Database error: {str(e)}")

# Function to download the lecture file from URL to a temporary local path
def download_lecture_file(lecture_url, lecture_title):
    # Validate URL
    if not lecture_url.startswith(('http://', 'https://')):
        raise ValueError(f"Invalid lecture_url: {lecture_url}. Must be a valid HTTP/HTTPS URL.")

    # Determine file extension from lecture_title or URL
    ext = os.path.splitext(lecture_title)[-1].lower() or os.path.splitext(lecture_url)[-1].lower()
    if not ext:
        ext = '.pptx'  # Default to .pptx if extension cannot be determined

    # Create a temporary file
    temp_dir = tempfile.mkdtemp()
    temp_file_path = os.path.join(temp_dir, f"lecture{ext}")

    # Download the file
    response = requests.get(lecture_url, stream=True, timeout=10)
    if response.status_code != 200:
        raise Exception(f"Failed to download lecture file from {lecture_url}: Status {response.status_code}")

    with open(temp_file_path, 'wb') as f:
        for chunk in response.iter_content(chunk_size=8192):
            if chunk:
                f.write(chunk)

    return temp_file_path, temp_dir

# Flask route to handle "Find Video" request
@video_finding_combine_bp.route('/video_finding_combine', methods=['GET'])
def find_video():
    print("✅ /video_finding_combine route hit")
    temp_dir = None
    try:
        course_id = request.args.get('course_id')
        lecture_id = request.args.get('lecture_id')
        if not course_id or not lecture_id:
            return jsonify({'error': 'course_id and lecture_id are required'}), 400

        course_id = int(course_id)
        lecture_id = int(lecture_id)

        lecture_url, lecture_title = get_lecture_file_url(course_id, lecture_id)

        print(f"Course ID: {course_id}")
        print(f"Lecture ID: {lecture_id}")
        print(f"Lecture URL: {lecture_url}")

        file_path, temp_dir = download_lecture_file(lecture_url, lecture_title)

        extracted_text, summary, content_keywords, title_keyword, combined_keywords = process_document(file_path)

        # Print the keywords here in backend console/logs
        print("Content Keywords:", content_keywords)
        print("Title Keyword:", title_keyword)
        print("Combined Keywords:", combined_keywords)

        video_transcripts = search_videos_from_keywords(combined_keywords, max_results_per_keyword=50)

        transcripts_folder = 'transcripts'  # Adjust path if needed
        matcher = SemanticTranscriptMatcher()

        matches = matcher.match_document_with_transcripts(file_path, transcripts_folder)

        if extracted_text.startswith("Error") or not content_keywords:
            return jsonify({'error': 'Failed to process document', 'details': extracted_text}), 500
        matcher.save_top_match_to_db(
        matches,
        db_config=get_db_config(),
        course_id=course_id,
        lecture_id=lecture_id,
        video_title=lecture_title,  # or a more specific matched title if available
        video_url="https://www.youtube.com/watch?v=matched_segment"  # Replace with actual match if possible
    )

        # You can still return minimal JSON if needed, or just return success
        return jsonify({
            'course_id': course_id,
            'lecture_id': lecture_id,
            'lecture_url': lecture_url,
            'lecture_title': lecture_title,
            'summary': summary,
            'content_keywords': content_keywords,
            'title_keyword': title_keyword,
            'combined_keywords': combined_keywords,
            'video_transcripts': video_transcripts
        }), 200
    
    

    except FileNotFoundError as e:
        return jsonify({'error': str(e)}), 404
    except mysql.connector.Error as e:
        return jsonify({'error': f'Database error: {str(e)}'}), 500
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({'error': f'Unexpected error: {str(e)}'}), 500
    finally:
        if temp_dir and os.path.exists(temp_dir):
            shutil.rmtree(temp_dir)
