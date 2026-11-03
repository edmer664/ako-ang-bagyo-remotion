import subprocess
import sys
import os

scenes = [
    ("scene_2_verse1_4k.png", 900),
    ("scene_3_prechorus_4k.png", 1600),
    ("scene_4_chorus1_4k.png", 2400),
    ("scene_5_verse2_4k.png", 2900),
    ("scene_6_chorus2_4k.png", 4500),
    ("scene_7_bridge_4k.png", 6000),
    ("scene_8_outro_4k.png", 7500),
]

my_video_dir = os.path.join(os.getcwd(), "my-video")
out_dir = os.path.join(my_video_dir, "out", "qa_high_res")
os.makedirs(out_dir, exist_ok=True)

print("Starting 4K High-Res Stills Rendering (Scale: 2, 3840x2160)...")

for name, frame in scenes:
    out_path = os.path.join("out", "qa_high_res", name)
    print(f"\n>>> Rendering {name} at frame {frame} (Scale: 2)...")
    cmd = [
        "npx.cmd",
        "remotion",
        "still",
        "AkoAngBagyo",
        out_path,
        f"--frame={frame}",
        "--scale=2",
        "--overwrite",
    ]
    res = subprocess.run(cmd, cwd=my_video_dir, capture_output=True, text=True)
    if res.returncode != 0:
        print(f"Error rendering {name}: {res.stderr}")
    else:
        print(f"Successfully rendered {name}")

print("\nAll 4K high-res scene stills rendered successfully!")
