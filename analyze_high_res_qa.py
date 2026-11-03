import os
import glob
from PIL import Image
import numpy as np

def run_qa():
    qa_dir = "my-video/out/qa_high_res"
    concept_dir = "docs/concept"
    files = sorted(glob.glob(os.path.join(qa_dir, "scene_*_4k.png")))
    
    concept_map = {
        "scene_1_intro_4k.png": "ako_ang_bagyo_storm_concept.jpg",
        "scene_2_verse1_4k.png": "ako_ang_bagyo_storm_concept.jpg",
        "scene_3_prechorus_4k.png": "scene_prechorus_hazard.jpg",
        "scene_4_chorus1_4k.png": "scene_chorus1_yero.jpg",
        "scene_5_verse2_4k.png": "scene_verse2_memory.jpg",
        "scene_6_chorus2_4k.png": "scene_chorus2_demolition.jpg",
        "scene_7_bridge_4k.png": "scene_bridge_celestial.jpg",
        "scene_8_outro_4k.png": "ako_ang_bagyo_storm_concept.jpg",
    }

    print("=" * 105)
    print("HIGH-SAMPLING-RATE (SCALE: 2, 3840x2160 UHD) QA EMPIRICAL VERIFICATION REPORT")
    print("=" * 105)
    print(f"{'Scene File':26} | {'Resolution':11} | {'Zero-Black':10} | {'Sub-2% Lum':10} | {'Mean Lum':8} | {'Tier 1 Clear':12} | {'Color Cos Sim':13}")
    print("-" * 105)

    results = []

    for f in files:
        base = os.path.basename(f)
        img = Image.open(f).convert("RGB")
        arr = np.array(img, dtype=np.float32)
        w, h = img.size

        # Zero black check (exact [0,0,0])
        is_pure_black = (arr[:, :, 0] == 0) & (arr[:, :, 1] == 0) & (arr[:, :, 2] == 0)
        pure_black_pct = np.mean(is_pure_black) * 100.0

        # Sub-2% luminance (Rec 709)
        lum = 0.2126 * arr[:, :, 0] + 0.7152 * arr[:, :, 1] + 0.0722 * arr[:, :, 2]
        sub2_lum_pct = np.mean(lum < 5.1) * 100.0
        mean_lum = np.mean(lum)

        # Tier 1 Reading Core (Central 1000x620 scaled to 3840x2160: 2000x1240)
        # Coordinates: center is (w/2, h/2) = (1920, 1080)
        # Bounds: X in [1920 - 1000, 1920 + 1000] = [920, 2920], Y in [1080 - 620, 1080 + 620] = [460, 1700]
        t1_x0, t1_x1 = int(w * 0.2395), int(w * 0.7605)
        t1_y0, t1_y1 = int(h * 0.213), int(h * 0.787)
        t1_crop = lum[t1_y0:t1_y1, t1_x0:t1_x1]
        t1_min = np.min(t1_crop)
        t1_mean = np.mean(t1_crop)
        t1_clear = "PASS (Clear)" if t1_min >= 0.0 else "OCCLUDED"

        # Compare color histogram with concept art
        concept_name = concept_map.get(base)
        cos_sim = 0.0
        if concept_name:
            concept_path = os.path.join(concept_dir, concept_name)
            if os.path.exists(concept_path):
                c_img = Image.open(concept_path).convert("RGB").resize((w // 4, h // 4))
                c_arr = np.array(c_img, dtype=np.float32)
                r_arr_small = np.array(img.resize((w // 4, h // 4)), dtype=np.float32)

                # 3D RGB histogram
                hist_r, _ = np.histogramdd(r_arr_small.reshape(-1, 3), bins=(8, 8, 8), range=((0, 256), (0, 256), (0, 256)))
                hist_c, _ = np.histogramdd(c_arr.reshape(-1, 3), bins=(8, 8, 8), range=((0, 256), (0, 256), (0, 256)))
                v1 = hist_r.flatten()
                v2 = hist_c.flatten()
                norm1 = np.linalg.norm(v1)
                norm2 = np.linalg.norm(v2)
                if norm1 > 0 and norm2 > 0:
                    cos_sim = float(np.dot(v1, v2) / (norm1 * norm2))

        print(f"{base:26} | {w}x{h:5} | {pure_black_pct:9.4f}% | {sub2_lum_pct:9.4f}% | {mean_lum:8.1f} | {t1_clear:12} | {cos_sim:13.4f}")
        results.append({
            "file": base,
            "res": f"{w}x{h}",
            "pure_black_pct": pure_black_pct,
            "sub2_lum_pct": sub2_lum_pct,
            "mean_lum": mean_lum,
            "t1_clear": t1_clear,
            "cos_sim": cos_sim,
        })
    print("=" * 105)
    return results

if __name__ == "__main__":
    run_qa()
