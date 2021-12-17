from yt_dlp import YoutubeDL
import json

base_url = "https://www.youtube.com/watch?v="
ydl_opts = {
    'format': 'bestaudio',
    'noplaylist':'True'
}
q = "u6BoyOceiPE"

url = base_url + q
with YoutubeDL(ydl_opts) as ydl:
    info = ydl.extract_info(url,download=False)
    playurl = info['url']
    
data = {
    "video_id" : q,
    'title' : info.get("title"),
    # 'description' : info.get("description"),
    "playurl" : playurl,
}
print(data)