import sys
import subprocess
import glob
import os

def install_and_import():
    try:
        from PIL import Image
    except ImportError:
        print("Installing Pillow...")
        subprocess.check_call([sys.executable, "-m", "pip", "install", "Pillow"])
    
install_and_import()
from PIL import Image

image_files = sorted(glob.glob(r'C:\Users\khan\.gemini\antigravity\brain\d35d0977-ed46-40af-8686-4c4d015bd84a\media__*.jpg'))

if not image_files:
    print("No images found.")
    sys.exit(1)

images = [Image.open(f) for f in image_files]

# Base width to resize to
target_width = 800
target_height = int(images[0].height * (target_width / images[0].width))

resized_images = []
for img in images:
    h = int(img.height * (target_width / img.width))
    resized_images.append(img.resize((target_width, h), Image.Resampling.LANCZOS))

# We have 5 images. Let's make a grid:
# Row 1: 3 images
# Row 2: 2 images (centered or just max width)
cols = min(3, len(images))
rows = (len(images) + cols - 1) // cols

collage_w = target_width * cols
collage_h = target_height * rows

collage = Image.new('RGB', (collage_w, collage_h), (20, 25, 40)) # slight dark background to match site

for i, img in enumerate(resized_images):
    row = i // cols
    col = i % cols
    # For the second row with 2 images, to center them we add target_width/2 offset
    offset_x = col * target_width
    if row == 1 and len(images) == 5:
        offset_x += target_width // 2
    offset_y = row * target_height
    
    collage.paste(img, (offset_x, offset_y))

out_path = r'C:\Users\khan\hooria-builders\hooria-builders-main\assets\images\hero-collage.jpg'
os.makedirs(os.path.dirname(out_path), exist_ok=True)
collage.save(out_path, quality=90)
print(f"Collage saved to {out_path}")
