import os
import subprocess
import sys

# Mapping the UI Intensity/Levels to Windows Compact Algorithms
# XPRESS4K = Fastest/Lightest (Standard)
# LZX = Slowest/Strongest (Potato)
level_map = {
    "15": "XPRESS4K",   # Standard
    "30": "XPRESS8K",   # Balanced
    "65": "XPRESS16K",  # Extreme
    "85": "LZX",        # Potato
    "standard": "XPRESS4K",
    "balance": "XPRESS8K",
    "extreme": "XPRESS16K",
    "potato": "LZX"
}

def get_algorithm(mode_or_percent):
    """
    Translates the UI selection into a Windows-recognized 
    compression algorithm.
    """
    key = str(mode_or_percent).lower()
    # Default to LZX if the key isn't found
    return level_map.get(key, "LZX")

def compress_game(folder_path, intensity_level):
    """
    Runs the Windows CompactOS engine on the entire game directory.
    This replaces the video-only compression.
    """
    algorithm = get_algorithm(intensity_level)
    
    print(f"--- HOT POTATO ENGINE START ---")
    print(f"Targeting Game: {folder_path}")
    print(f"Intensity Level: {intensity_level} (Algorithm: {algorithm})")
    
    # We use the Windows 'compact' tool on the WHOLE folder.
    # /C = Compress
    # /S = Include subdirectories
    # /EXE = Specific algorithm for executables and game data
    # /I = Ignore errors (useful if a file is open)
    # /F = Force compression on all files
    command = f'compact /C /S /EXE:{algorithm} /I /F "{folder_path}\\*"'
    
    try:
        print(f"Executing {algorithm} System Compression... Please wait.")
        # Execute the system command
        subprocess.run(command, shell=True, check=True)
        print(f"\nSUCCESS: The Steam game at {folder_path} has been optimized.")
    except Exception as e:
        print(f"\nFATAL ERROR during compression: {e}")

if __name__ == "__main__":
    # Expecting: python core.py "C:\Path\To\Game" "85"
    if len(sys.argv) < 3:
        print("Usage: core.py <folder_path> <intensity_level>")
    else:
        folder = sys.argv[1]
        level = sys.argv[2]
        compress_game(folder, level)
