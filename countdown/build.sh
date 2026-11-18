#!/bin/bash
# Full build: parallel silent render -> join -> mux soundtrack.
# Usage: ./build.sh [page.html] [out.mp4] [workers]
#   ./build.sh                                        -> chapel-countdown.mp4 (1920x1080)
#   ./build.sh led-wall.html chapel-countdown-led-wall.mp4   (LED wall map)
set -e
cd "$(dirname "$0")"
PAGE=${1:-flipboard.html}
OUT=${2:-chapel-countdown.mp4}
J=${3:-4}
BASE=$(basename "$PAGE" .html)
node render.js --flaps --page "$PAGE"
python3 soundtrack.py "flaps-$BASE.json" "frames/$BASE.wav"
DUR=$(node -e "console.log(require('./flaps-$BASE.json').duration)")
mkdir -p frames
rm -f frames/${BASE}_part_*.mp4 frames/${BASE}_parts.txt
for i in $(seq 0 $((J-1))); do
  A=$(python3 -c "print($DUR*$i/$J)"); B=$(python3 -c "print($DUR*($i+1)/$J)")
  node render.js frames/${BASE}_part_$i.mp4 30 --page "$PAGE" --range $A,$B 2>frames/${BASE}_part_$i.log &
  echo "file '${BASE}_part_$i.mp4'" >> frames/${BASE}_parts.txt
done
wait
ffmpeg -y -loglevel error -f concat -safe 0 -i frames/${BASE}_parts.txt -c copy frames/${BASE}_silent.mp4
ffmpeg -y -loglevel error -i frames/${BASE}_silent.mp4 -i frames/$BASE.wav -c:v copy -c:a aac -b:a 192k -shortest "$OUT"
echo done
