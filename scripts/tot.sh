#!/usr/bin/env bash

list=$(rg -i '<li>' ../logs/sf_log.html | wc -l)
workouts=$(rg -i 'run|WOD|march|ride|Interval' ../logs/sf_log.html | wc -l)
current=$(rg -i 'Done: ' ../logs/sf_log.html | awk '{print $2}')
total=$(echo "$workouts/$list")

sed -i "s|Done: $current|Done: $total|" ../logs/sf_log.html
