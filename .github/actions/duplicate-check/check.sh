#!/bin/bash
set -eo pipefail

WARNING_THRESHOLD=$1
FAILURE_THRESHOLD=$2

# Run duplication check and capture output
OUTPUT=$(pnpm find-copies 2>&1)
EXIT_CODE=$?

# Parse total duplication percentage
TOTAL_PERCENT=$(echo "$OUTPUT" | awk '/Total:.*[0-9]+ \([0-9.]+%\)/ {gsub(/[()%]/,""); print $(NF-2)}')

# Determine exit code based on thresholds
if [ -n "$TOTAL_PERCENT" ] && [ "$(echo "$TOTAL_PERCENT >= $FAILURE_THRESHOLD" | bc -l)" -eq 1 ]; then
  echo "::error::Code duplication exceeded failure threshold ($FAILURE_THRESHOLD%) - Found ${TOTAL_PERCENT}%"
  exit 2
elif [ -n "$TOTAL_PERCENT" ] && [ "$(echo "$TOTAL_PERCENT >= $WARNING_THRESHOLD" | bc -l)" -eq 1 ]; then
  echo "::warning::Code duplication exceeded warning threshold ($WARNING_THRESHOLD%) - Found ${TOTAL_PERCENT}%"
  exit 1
elif [ $EXIT_CODE -ne 0 ]; then
  echo "::warning::Duplicate code found (${TOTAL_PERCENT}%)"
  exit 1
else
  echo "No significant code duplication found"
  exit 0
fi