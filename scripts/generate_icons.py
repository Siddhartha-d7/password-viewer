import os
from PIL import Image, ImageDraw

def draw_eye_icon(size):
    # Create image with transparent background
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Calculate dimensions scaling with size
    padding = max(1, int(size * 0.06))
    card_radius = max(2, int(size * 0.22))
    
    # Background: Premium Indigo brand color (99, 102, 241)
    draw.rounded_rectangle(
        [(padding, padding), (size - padding - 1, size - padding - 1)],
        radius=card_radius,
        fill=(99, 102, 241, 255)
    )
    
    cx, cy = size // 2, size // 2
    
    # Inner eye dimensions
    w = int(size * 0.64)
    h = int(size * 0.36)
    stroke_w = max(1, int(size * 0.06))
    
    # Draw outer eye frame (ellipse)
    draw.ellipse(
        [(cx - w//2, cy - h//2), (cx + w//2, cy + h//2)],
        outline=(255, 255, 255, 255),
        width=stroke_w
    )
    
    # Draw Iris (White outer circle)
    iris_r = int(size * 0.15)
    draw.ellipse(
        [(cx - iris_r, cy - iris_r), (cx + iris_r, cy + iris_r)],
        fill=(255, 255, 255, 255)
    )
    
    # Draw Pupil (Indigo inner circle)
    pupil_r = int(size * 0.08)
    draw.ellipse(
        [(cx - pupil_r, cy - pupil_r), (cx + pupil_r, cy + pupil_r)],
        fill=(99, 102, 241, 255)
    )
    
    return img

def main():
    os.makedirs("icons", exist_ok=True)
    for size in [16, 48, 128]:
        img = draw_eye_icon(size)
        img.save(f"icons/icon{size}.png")
        print(f"Generated icons/icon{size}.png")

if __name__ == "__main__":
    main()
