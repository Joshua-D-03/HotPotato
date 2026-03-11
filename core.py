import os
import subprocess
import sys

def check_dependencies():
    # Fix: Ensure ffmpeg.exe exists locally
    local_ffmpeg = os.path.join(os.path.dirname(__file__), "ffmpeg.exe")
    if not os.path.exists(local_ffmpeg):
        print("ERROR: ffmpeg.exe not found in this folder!")
        print("Please place ffmpeg.exe next to this script.")
        input("Press Enter to exit...")
        sys.exit()
    return local_ffmpeg

def get_compression_settings(mode):
    # Performance = Fast/Small, Quality = Slow/Large
    modes = {
        "performance": {"crf": "28", "preset": "faster"},
        "balanced": {"crf": "24", "preset": "medium"},
        "quality": {"crf": "20", "preset": "slow"}
    }
    return modes.get(mode.lower(), modes["balanced"])

def compress_game(folder_path, mode):
    ffmpeg_cmd = check_dependencies()
    config = get_compression_settings(mode)

    for root, _, files in os.walk(folder_path):
        for file in files:
            if file.lower().endswith(('.mp4', '.avi', '.mkv', '.wmv')):
                input_path = os.path.join(root, file)
                output_path = os.path.join(root, f"POTATO_{file}")
                
                print(f"Compressing ({mode}): {file}...")
                try:
                    subprocess.run([
                        ffmpeg_cmd, '-y', '-i', input_path, 
                        '-vcodec', 'libx265', 
                        '-crf', config["crf"], 
                        '-preset', config["preset"], 
                        output_path
                    ], check=True)
                except Exception as e:
                    print(f"Error processing {file}: {e}")

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: core.py <folder_path> <mode>")
    else:
        compress_game(sys.argv[1], sys.argv[2])
# Replace the crf_map in core.py with this:
def get_compression_settings(mode):
    # Performance = Smaller files, lower quality
    # Quality = Better looking, larger files
    # Balanced = The middle ground
    modes = {
        "performance": {"crf": "28", "preset": "faster"},
        "balanced": {"crf": "24", "preset": "medium"},
        "quality": {"crf": "20", "preset": "slow"}
    }
    return modes.get(mode.lower(), modes["balanced"])

# Inside your subprocess.run, update the arguments:
settings = get_compression_settings(level) # level is now the mode name
subprocess.run([
    ffmpeg_cmd, '-y', '-i', input_path, 
    '-vcodec', 'libx265', 
    '-crf', settings["crf"], 
    '-preset', settings["preset"], 
    output_path
], check=True)
