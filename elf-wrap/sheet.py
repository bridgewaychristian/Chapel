import sys
from PIL import Image
fs = sys.argv[2:]
out = sys.argv[1]
w = 1920; h = 540
s = Image.new('RGB', (w, (h // 2 + 6) * len(fs)), (255, 0, 255))
for i, f in enumerate(fs):
    im = Image.open(f'frames/still_{float(f):.2f}.jpg').resize((w, h)).crop((0, 0, w, h // 2 + 2))
    s.paste(im, (0, i * (h // 2 + 6)))
s.save(out)
