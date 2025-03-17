#!/bin/bash
set -eo pipefail

WARNING_THRESHOLD=$1
FAILURE_THRESHOLD=$2

OUTPUT=$(pnpm find-copies 2>&1)
EXIT_CODE=$?

# Parse total duplication percentage (handling Unicode table separators)
TOTAL_PERCENT=$(echo "$OUTPUT" | awk -F '│' '/Total:/ {gsub(/[()%]/, "", $8); split($8, parts, " "); print parts[2]}')

# Validate numeric value
if ! echo "$TOTAL_PERCENT" | grep -Eq '^[0-9]+(\.[0-9]+)?$'; then
  echo "::error::Failed to parse duplication percentage from output"
  exit 1
fi

# Floating-point comparisons
if (( $(echo "$TOTAL_PERCENT >= $FAILURE_THRESHOLD" | bc -l) )); then
  echo "::error::Code duplication exceeded failure threshold ($FAILURE_THRESHOLD%) - Found ${TOTAL_PERCENT}%"
  exit 2
elif (( $(echo "$TOTAL_PERCENT >= $WARNING_THRESHOLD" | bc -l) )); then
  echo "::warning::Code duplication exceeded warning threshold ($WARNING_THRESHOLD%) - Found ${TOTAL_PERCENT}%"
  exit 1
elif [ $EXIT_CODE -ne 0 ]; then
  echo "::warning::Duplicate code found (${TOTAL_PERCENT}%)"
  exit 1
else
  echo "No significant code duplication found"
  exit 0
fi