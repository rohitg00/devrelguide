#!/bin/bash

# Script to generate test visualizations for the DevRel Whitepaper project
# This is useful for local development and testing

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
BASE_DIR="$(dirname "$(dirname "$SCRIPT_DIR")")"
OUTPUT_DIR="$BASE_DIR/static/visualizations"

echo "Generating test visualizations in $OUTPUT_DIR"
mkdir -p "$OUTPUT_DIR"

# Run the Python script to generate visualizations
cd "$BASE_DIR"
python -m scripts.generate_visualizations

# Check if visualizations were successfully generated
if [ $? -eq 0 ]; then
    echo "✅ Visualizations generated successfully"
    echo "Files in $OUTPUT_DIR:"
    ls -la "$OUTPUT_DIR"
else
    echo "❌ Failed to generate visualizations"
    exit 1
fi

echo "🚀 Done!"
