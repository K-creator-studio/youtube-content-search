
import whisper
import yt_dlp as youtube_dl
import requests
from urllib.parse import urlparse, parse_qs
from youtube_transcript_api import YouTubeTranscriptApi, TranscriptsDisabled
import os
import json
from config import api_key  # Import the API key from config.py
from document_reader import process_document , get_default_file_path
import nltk
nltk.download('punkt')

# Load Whisper model for fallback transcription
whisper_model = whisper.load_model("base", device="cpu")


# Function to extract video ID from YouTube URL
def extract_video_id(youtube_url):
    parsed_url = urlparse(youtube_url)
    if parsed_url.hostname == "youtu.be":
        return parsed_url.path[1:]
    if parsed_url.hostname in ["www.youtube.com", "youtube.com"]:
        return parse_qs(parsed_url.query).get("v", [None])[0]
    return None
 

def save_transcript_to_txt(video_id, transcript_text, video_url, source="YouTube"):
    file_path = f"transcripts/{video_id}_transcript_{source}.txt"

    if not os.path.exists('transcripts'):
        os.makedirs('transcripts')

    with open(file_path, "w", encoding="utf-8") as f:
        f.write(f"Video URL: {video_url}\n\n")

        if isinstance(transcript_text, str):
            f.write(transcript_text)
        elif isinstance(transcript_text, list):
            for line in transcript_text:
                start = line.get('start', 0)
                duration = line.get('duration', 0)
                end = start + duration
                text = line.get('text', '')
                f.write(f"{format_time(start)} --> {format_time(end)}\n{text}\n\n")
        else:
            print("[WARNING] Unexpected transcript format; nothing saved.")

    print(f"[INFO] Transcript saved to {file_path}")
    return file_path


def format_time(seconds):
    """Format time in seconds to hh:mm:ss format."""
    minutes, seconds = divmod(seconds, 60)
    hours, minutes = divmod(minutes, 60)
    return f"{int(hours):02}:{int(minutes):02}:{int(seconds):02}"


def split_transcript_into_segments(transcript_text):
    """Split the transcript into segments based on time."""
    segments = []
    lines = transcript_text.split("\n")
    start_time = 0.0
    for line in lines:
        segments.append({
            "start": start_time,
            "end": start_time + 5,
            "text": line
        })
        start_time += 5
    return segments

def get_video_transcript(youtube_url, keyword):
    video_id = extract_video_id(youtube_url)

    if not video_id:
        print(f"[ERROR] Could not extract video ID from URL: {youtube_url}")
        return None

    print(f"[INFO] Extracting transcript for video {video_id} found via keyword: {keyword}")

    try:
        transcript = YouTubeTranscriptApi.get_transcript(video_id, languages=["en"])
        if transcript:
            # Keep original segments with timestamps intact
            print(f"[INFO] Transcript for video {video_id} found via keyword '{keyword}': {transcript[0]['text'][:100]}...")
            
            # Save the transcript with real timing info
            save_transcript_to_txt(video_id, transcript, youtube_url)

            return transcript  # Return original segments
        else:
            print(f"[INFO] No transcript found in English for video {video_id}. Using Whisper fallback...")
            return transcribe_video_with_whisper(youtube_url)
    except TranscriptsDisabled:
        print("[ERROR] Transcripts are disabled for this video.")
        return transcribe_video_with_whisper(youtube_url)
    except Exception as e:
        print(f"[ERROR] Failed to fetch YouTube transcript: {e}")
        return transcribe_video_with_whisper(youtube_url)


def transcribe_video_with_whisper(youtube_url):
    video_id = extract_video_id(youtube_url)
    # Download audio as a fallback when transcript is not available
    audio_file = download_audio(youtube_url, video_id)

    if audio_file:
        print(f"[INFO] Audio file {audio_file} downloaded successfully. Transcribing with Whisper...")

        try:
            # Perform transcription using Whisper
            result = whisper_model.transcribe(audio_file)

            # Check if transcription returned text
            if "text" in result:
                transcript_text = result["text"]
                print(f"[INFO] Transcription completed: {transcript_text}")

                # Manually create segments based on a fixed time interval (e.g., 5 seconds per segment)
                segments = []
                words = transcript_text.split()  # Split the transcription into words
                start_time = 0.0

                # Split words into segments of 5 seconds each (or adjust as needed)
                for i in range(0, len(words), 5):
                    segment_text = ' '.join(words[i:i + 5])  # Take 5 words per segment
                    end_time = start_time + 5  # Increment the time for each segment
                    segments.append({
                        "start": start_time,
                        "end": end_time,
                        "text": segment_text
                    })
                    start_time = end_time  # Update the start time for the next segment

                # Save the transcript in a text file
                save_transcript_to_txt(video_id, segments, youtube_url)

                return transcript_text

            else:
                print("[ERROR] Transcription did not return text.")
                return None
        except Exception as e:
            print(f"[ERROR] Whisper transcription failed: {e}")
            return None
    else:
        print("[ERROR] Failed to download audio.")
    return None


def create_tmp_audio_directory():
    if not os.path.exists('tmp_audio'):
        os.makedirs('tmp_audio')


# def download_audio(video_url, video_id, cookies_file='cookies.txt'):
#     # Ensure the tmp_audio directory exists
#     create_tmp_audio_directory()

#     output_path = f"tmp_audio/{video_id}.mp3"  # Save audio in the tmp_audio folder
#     print(f"[INFO] Downloading audio to: {os.path.abspath(output_path)}")  # Print absolute path for debugging

#     ydl_opts = {
#         "outtmpl": output_path,
#         "format": "bestaudio",
#         "quiet": False,
#         "no_warnings": True,
#         "cookies": cookies_file,
#         "postprocessors": [{
#             "key": "FFmpegExtractAudio",
#             "preferredcodec": "mp3",
#             "preferredquality": "192",
#         }],
#     }

#     try:
#         print(f"[INFO] Downloading audio for video {video_id}...")
#         with youtube_dl.YoutubeDL(ydl_opts) as ydl:
#             ydl.download([video_url])

#         # processed_file_path = f"tmp_audio/{video_id}.mp3.mp3"
#         processed_file_path = output_path  # Use the actual downloaded file path


#         if os.path.exists(processed_file_path):
#             print(f"[INFO] Audio successfully extracted to: {os.path.abspath(processed_file_path)}")
#             return processed_file_path
#         else:
#             print(f"[ERROR] Processed audio file does not exist: {processed_file_path}")
#             return None
#     except Exception as e:
#         print(f"[ERROR] Audio download failed: {e}")
#         return None

def download_audio(video_url, video_id, cookies_file='cookies.txt'):
    # Ensure the tmp_audio directory exists
    create_tmp_audio_directory()

    output_path = f"tmp_audio/{video_id}"  # Remove .mp3 from outtmpl
    print(f"[INFO] Downloading audio to: {os.path.abspath(output_path)}.mp3")

    ydl_opts = {
        "outtmpl": output_path,  # Let postprocessor add .mp3
        "format": "bestaudio",
        "quiet": False,
        "no_warnings": True,
        "cookies": cookies_file,
        "postprocessors": [{
            "key": "FFmpegExtractAudio",
            "preferredcodec": "mp3",
            "preferredquality": "192",
        }],
    }

    try:
        print(f"[INFO] Downloading audio for video {video_id}...")
        with youtube_dl.YoutubeDL(ydl_opts) as ydl:
            ydl.download([video_url])

        processed_file_path = f"tmp_audio/{video_id}.mp3"  # Check for correct .mp3 file
        if os.path.exists(processed_file_path):
            print(f"[INFO] Audio successfully extracted to: {os.path.abspath(processed_file_path)}")
            return processed_file_path
        else:
            print(f"[ERROR] Processed audio file does not exist: {processed_file_path}")
            possible_file = f"tmp_audio/{video_id}.mp3.mp3"
            if os.path.exists(possible_file):
                print(f"[INFO] Found file with unexpected extension: {possible_file}. Renaming...")
                os.rename(possible_file, processed_file_path)
                return processed_file_path
            return None
    except Exception as e:
        print(f"[ERROR] Audio download failed: {e}")
        return None

def search_videos_from_keywords(combined_keywords, max_results_per_keyword=100):
    """
    Given a list of keywords, search for relevant videos and fetch their transcripts.
    """
    cleaned_keywords = clean_keywords(combined_keywords)

    video_data = get_relevant_videos(cleaned_keywords, max_results_per_keyword)
    print(f"[INFO] Video ranking completed for combined keywords.")

    transcripts_data = []

    for video in video_data['videos']:
        video_url = video['url']
        video_id = video['id']
        keyword = video.get('keyword', '')

        print(f"[INFO] Fetching transcript for video: {video_url} (keyword: {keyword})")
        transcript = get_video_transcript(video_url, keyword)

        transcripts_data.append({
            'video_id': video_id,
            'video_url': video_url,
            'keyword': keyword,
            'transcript': transcript
        })

    return transcripts_data


def search_videos(api_key, search_query, max_results=100):
    """
    Search YouTube videos for a given query with a limit on the number of results.
    """
    base_url = "https://www.googleapis.com/youtube/v3/search"
    params = {
        "part": "snippet",
        "q": search_query,
        "type": "video",
        "maxResults": max_results,
        "key": api_key
    }

    video_data = []
    response = requests.get(base_url, params=params)

    if response.status_code == 200:
        data = response.json()
        for item in data.get("items", []):
            video_id = item["id"].get("videoId")
            video_title = item["snippet"]["title"]
            video_link = f"https://www.youtube.com/watch?v={video_id}"
            stats = get_video_stats(video_id)
            video_data.append({
                "title": video_title,
                "url": video_link,
                "id": video_id,
                "views": stats.get("views", 0),
                "likes": stats.get("likes", 0),
                "comments": stats.get("comments", 0)
            })
    else:
        print(f"[ERROR] Failed to fetch data from YouTube API: {response.status_code}")

    return video_data


def get_video_stats(video_id):
    url = "https://www.googleapis.com/youtube/v3/videos"
    params = {
        "part": "statistics,snippet",
        "id": video_id,
        "key": api_key
    }
    response = requests.get(url, params=params)
    stats = {}
    title = ""
    description = ""

    if response.status_code == 200:
        items = response.json().get("items", [])
        if items:
            stats = items[0].get("statistics", {})
            snippet = items[0].get("snippet", {})
            title = snippet.get("title", "")
            description = snippet.get("description", "")

    return {
        "title": title,
        "description": description,
        "views": int(stats.get("viewCount", 0)),
        "likes": int(stats.get("likeCount", 0)),  # Default to 0 if 'likeCount' is missing
        "comments": int(stats.get("commentCount", 0))  # Default to 0 if 'commentCount' is missing
    }


def get_relevant_videos(keywords, max_results_per_keyword=100):

    all_video_links = []  # Store all videos from each keyword search

    # Perform a search for each individual keyword in the given order
    for keyword in keywords:
        print(f"[INFO] Searching for videos with keyword: {keyword}")
        video_links = search_videos(api_key, keyword, max_results=max_results_per_keyword)
        print(f"[INFO] Found {len(video_links)} videos for keyword: {keyword}")

        # Add the keyword to each video in the video_links
        if video_links:
            for video in video_links:
                video['keyword'] = keyword  # Add the keyword responsible for this video
            all_video_links.extend(video_links)  # Add videos to the main list

    # Rank all videos based on views, likes, comments (can be adjusted)
    ranked_videos = sorted(
        all_video_links,
        key=lambda v: (v['likes'], v['comments'], v['views']),
        reverse=True
    )

    return {
        "query": " ".join(keywords),  # Combined query for debugging
        "videos": ranked_videos,
    }


def clean_keywords(keywords):
    cleaned_keywords = []

    for keyword in keywords:
        # Replace hyphen with comma
        cleaned_keyword = keyword.replace('–', ',')

        # Remove extra spaces and strip leading/trailing spaces
        cleaned_keyword = ' '.join(cleaned_keyword.split())  # This reduces multiple spaces to one

        # Add the cleaned keyword to the list
        cleaned_keywords.append(cleaned_keyword)

    return cleaned_keywords


# def upload_document(file_path, max_results_per_keyword=100):
#     """
#     Process a document and get relevant video transcripts based on keywords extracted from the document.
#     """
#     create_tmp_audio_directory()  # Ensure tmp_audio directory is created before processing
#     try:
#         # Extract text, summary, and combined keywords from the document
#         extracted_text, summary, content_keywords, title_keyword, combined_keywords = process_document(file_path)

#         if not combined_keywords or len(combined_keywords) == 0:
#             return {"error": "No keywords extracted from the document."}, 404

#         print(f"Extracted keywords: {content_keywords}")
#         print(f"Title keyword: {title_keyword}")
#         print(f"Combined keywords: {combined_keywords}")

#         # Clean the combined keywords for YouTube search
#         cleaned_keywords = clean_keywords(combined_keywords)

#         # Get relevant videos based on cleaned keywords
#         video_data = get_relevant_videos(cleaned_keywords, max_results_per_keyword)
#         print(f"Video ranking: {video_data}")

#         if isinstance(video_data, tuple) and isinstance(video_data[0], dict) and video_data[0].get('error'):
#             return video_data

        


#         if not video_data:
#             return {"error": "No relevant videos found."}, 404

#         transcripts_data = []  # List to hold all video transcripts

#         # Extract transcripts for all the videos fetched
#         for video in video_data['videos']:
#             video_url = video['url']
#             video_id = video['id']
#             keyword = video.get('keyword')  # Fetch the keyword responsible for this video
#             print(f"[INFO] Extracting transcript for video {video_id} found via keyword: {keyword}")  # Log the keyword
#             transcript = get_video_transcript(video_url, keyword)  # Pass the keyword here
#             transcripts_data.append({
#                 "video_id": video_id,
#                 "transcript": transcript
#             })

#         # Save each transcript to a text file
#         for transcript_data in transcripts_data:
#             save_transcript_to_txt(transcript_data["video_id"], transcript_data["transcript"])

#         return {
#             "message": "Videos ranked and transcripts saved.",
#             "video_data": video_data
#         }
#     except Exception as e:
#         return {"error": str(e)}, 500

def upload_document(file_path, max_results_per_keyword=100):
    """
    Process a document and get relevant video transcripts based on keywords extracted from the document.
    """
    create_tmp_audio_directory()
    try:
        extracted_text, summary, content_keywords, title_keyword, combined_keywords = process_document(file_path)
        if not combined_keywords or len(combined_keywords) == 0:
            return {"error": "No keywords extracted from the document."}, 404

        print(f"Extracted keywords: {content_keywords}")
        print(f"Title keyword: {title_keyword}")
        print(f"Combined keywords: {combined_keywords}")

        cleaned_keywords = clean_keywords(combined_keywords)
        video_data = get_relevant_videos(cleaned_keywords, max_results_per_keyword)
        print(f"Video ranking: {video_data}")

        if isinstance(video_data, tuple) and isinstance(video_data[0], dict) and video_data[0].get('error'):
            return video_data

        if not video_data:
            return {"error": "No relevant videos found."}, 404

        transcripts_data = []
        for video in video_data['videos']:
            video_url = video['url']
            video_id = video['id']
            keyword = video.get('keyword')
            print(f"[INFO] Extracting transcript for video {video_id} found via keyword: {keyword}")
            transcript = get_video_transcript(video_url, keyword)
            transcripts_data.append({
                "video_id": video_id,
                "transcript": transcript,
                "video_url": video_url
            })

        for transcript_data in transcripts_data:
            save_transcript_to_txt(
                transcript_data["video_id"],
                transcript_data["transcript"],
                transcript_data["video_url"],
                source="YouTube"
            )

        return {
            "message": "Videos ranked and transcripts saved.",
            "video_data": video_data
        }
    except Exception as e:
        return {"error": str(e)}, 500
# Example of calling the function directly with the path of the document:
# Provide the actual file path
if __name__ == "__main__":
    file_path = get_default_file_path()  # Adjust this to your actual file path
    result = upload_document(file_path)
    print(result)


