#!/usr/bin/env bash
set -e

case "$1" in
  list)
    ls skills | sed 's/.md$//'
    ;;
  design)
    cat skills/design-system.md
    ;;
  architecture)
    cat skills/product-architecture.md
    ;;
  sky)
    cat skills/sky-system.md
    ;;
  cards)
    cat skills/magic-cards.md
    ;;
  mascot)
    cat skills/mascot.md
    ;;
  daily)
    cat skills/daily-flow.md
    ;;
  *)
    echo "Usage: ./scripts/skills.sh {list|design|architecture|sky|cards|mascot|daily}"
    exit 1
    ;;
esac
