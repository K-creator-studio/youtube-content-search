
import requests
import os
from header_files import api_key

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
    for _ in range(2):  # Two requests to get 100 videos
        if next_page_token:
            params["pageToken"] = next_page_token

        # Make the API request
        response = requests.get(base_url, params=params)
        
        if response.status_code != 200:
            print(f"[ERROR] Failed to fetch data from YouTube API: {response.status_code}")
            return []  # Return empty list if API request fails
        
        data = response.json()
        
        # Check if the response contains items
        if "items" not in data:
            print("[ERROR] No items found in YouTube API response.")
            return []  # Return empty list if no items are found

        # Iterate over the items in the response
        for item in data.get("items", []):
            # Accessing the 'id' and 'snippet' properties directly
            video_title = item["snippet"]["title"]
            video_id = item["id"].get("videoId")  # Use .get() to avoid key errors if videoId is missing
            if not video_id:
                continue  # Skip if videoId is missing

            video_link = f"https://www.youtube.com/watch?v={video_id}"

            # Append the video data as a dictionary
            video_data.append({
                "title": video_title,
                "url": video_link,
                "id": video_id
            })

        # Check for the next page of results
        next_page_token = data.get("nextPageToken")
        if not next_page_token:
            break

    print(f"\nTotal videos retrieved: {len(video_data)}")
    return video_data  # Return a list of dictionaries


if __name__ == "__main__":
    search_query = input(
      "Enter search query (press Enter to use default): "
     ) or "python tutorial"

    results = search_videos(api_key, search_query)
    print(f"Current working directory: {os.getcwd()}")

