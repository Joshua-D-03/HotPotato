import os
import subprocess
import sys

def compress_game(folder_path, level):
    # Mapping
    crf_map = {"0.15": "28", "0.30": "26", "0.65": "24", "0.85": "20"}
    crf = crf_map.get(level, "24")

    # FIX: Point to the local ffmpeg.exe in the same folder
    local_ffmpeg = os.path.join(os.path.dirname(__file__), "ffmpeg.exe")
    
    # If ffmpeg.exe isn't in the folder, try the system one
    ffmpeg_cmd = local_ffmpeg if os.path.exists(local_ffmpeg) else "ffmpeg"

    for root, _, files in os.walk(folder_path):
        for file in files:
            if file.lower().endswith(('.mp4', '.avi', '.mkv', '.wmv')):
                input_path = os.path.join(root, file)
                output_path = os.path.join(root, f"POTATO_{file}")
                
                print(f"Compressing: {file}...")
                try:
                    subprocess.run([
                        ffmpeg_cmd, '-y', '-i', input_path, 
                        '-vcodec', 'libx265', '-crf', crf, 
                        output_path
                    ], check=True)
                except Exception as e:
                    print(f"Error: {e}")

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: core.py <folder> <level>")
    else:
        compress_game(sys.argv[1], sys.argv[2])
