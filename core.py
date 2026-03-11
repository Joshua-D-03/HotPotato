import os
import subprocess
import sys

def compress_game(folder_path, level):
    # Map percentage to CRF (lower CRF = higher quality, higher size)
    # Using libx265 for efficient compression
    crf_map = {"0.15": "28", "0.30": "26", "0.65": "24", "0.85": "20"}
    crf = crf_map.get(level, "28")
    
    if not os.path.isdir(folder_path):
        print(f"Error: {folder_path} is not a valid directory.")
        return

    # Walk through the folder structure
    for root, dirs, files in os.walk(folder_path):
        for file in files:
            # Only target video files to keep the game stable
            if file.lower().endswith(('.mp4', '.avi', '.mkv', '.wmv')):
                input_path = os.path.join(root, file)
                output_path = os.path.join(root, f"POTATO_{file}")
                
                print(f"Processing: {file}...")
                
                # Call FFmpeg
                # -y forces overwrite if you run it again, -v quiet reduces clutter
                try:
                    subprocess.run([
                        'ffmpeg', '-y', '-i', input_path, 
                        '-vcodec', 'libx265', '-crf', crf, 
                        output_path
                    ], check=True)
                    print(f"Successfully compressed: {output_path}")
                except subprocess.CalledProcessError:
                    print(f"Error compressing {file}. Skipping.")

if __name__ == "__main__":
    # Ensure user provided the folder and level
    if len(sys.argv) < 3:
        print("Usage: python core.py <folder_path> <level_0.15_to_0.85>")
    else:
        compress_game(sys.argv[1], sys.argv[2])
      
