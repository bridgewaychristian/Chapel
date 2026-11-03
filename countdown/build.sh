#!/bin/bash
# Full build: parallel silent render -> join -> mux soundtrack.
# Usage: ./build.sh [workers]   -> chapel-countdown.mp4
set -e
cd "$(dirname "$0")"
J=${1:-4}
node render.js --flaps
python3 soundtrack.py
DUR=$(node -e "console.log(require('./flaps.json').duration)")
mkdir -p frames
rm -f frames/part_*.mp4 frames/parts.txt
for i in $(seq 0 $((J-1))); do
  A=$(python3 -c "print($DUR*$i/$J)"); B=$(python3 -c "print($DUR*($i+1)/$J)")
  node render.js frames/part_$i.mp4 30 --range $A,$B 2>frames/part_$i.log &
  echo "file 'part_$i.mp4'" >> frames/parts.txt
done
wait
ffmpeg -y -loglevel error -f concat -safe 0 -i frames/parts.txt -c copy frames/silent.mp4
ffmpeg -y -loglevel error -i frames/silent.mp4 -i soundtrack.wav -c:v copy -c:a aac -b:a 192k -shortest chapel-countdown.mp4
echo done
