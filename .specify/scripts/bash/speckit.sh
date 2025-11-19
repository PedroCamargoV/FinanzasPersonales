#!/usr/bin/env bash

# Specify Framework - Main CLI Entry Point
#
# This script provides a unified interface to all Specify framework commands.
# It delegates to specialized scripts for specific operations.
#
# Usage: ./speckit [COMMAND] [OPTIONS]
#
# COMMANDS:
#   init                Initialize Specify project structure
#   feature             Create a new feature branch
#   plan                Create implementation plan for current feature
#   check               Check prerequisites for current feature
#   tasks               Create task list from specification
#   context             Update AI agent context files
#   help                Show help information

set -e

# Get script directory
SCRIPT_DIR="$(CDPATH="" cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/../../.." && pwd)"

# Helper functions
print_help() {
    cat << 'EOF'
Specify Framework - Spec-Driven Development Workflow

USAGE: speckit [COMMAND] [OPTIONS]

COMMANDS:
  init [OPTIONS]              Initialize Specify project structure
    --force                   Overwrite existing files
    --with-git                Initialize as Git repository

  feature [OPTIONS] <description>  Create new feature branch
    --json                    Output in JSON format
    --short-name <name>       Custom branch name (2-4 words)
    --number <N>              Override feature number

  plan [OPTIONS]              Create implementation plan
    --json                    Output in JSON format

  check [OPTIONS]             Check feature prerequisites
    --json                    Output in JSON format
    --require-tasks           Require tasks.md to exist
    --include-tasks           Include tasks.md in available docs
    --paths-only              Only output paths (no validation)

  context [AGENT_TYPE]        Update AI agent context files
    (no args)                 Update all existing agent files
    [agent_type]              Update specific agent:
                              claude, gemini, copilot, cursor-agent,
                              qwen, opencode, windsurf, auggie, shai

  help                        Show this help message

EXAMPLES:
  # Initialize a new project
  speckit init --with-git

  # Create a new feature
  speckit feature "Add user authentication system"

  # Create implementation plan for current feature
  speckit plan

  # Check if all prerequisites are met
  speckit check --json

  # Update all agent context files
  speckit context

  # Update only Claude context file
  speckit context claude

ENVIRONMENT VARIABLES:
  SPECIFY_FEATURE           Set current feature (for non-git repos)
  SPECIFY_NO_COLOR         Disable colored output

DOCUMENTATION:
  See .specify/ directory for templates and configuration
  See README files in .specify/scripts/bash/ for detailed docs

EOF
}

# Parse command
COMMAND="${1:-help}"
shift || true

case "$COMMAND" in
    init)
        "$SCRIPT_DIR/speckit-init.sh" "$@"
        ;;
    feature)
        "$SCRIPT_DIR/create-new-feature.sh" "$@"
        ;;
    plan)
        "$SCRIPT_DIR/setup-plan.sh" "$@"
        ;;
    check)
        "$SCRIPT_DIR/check-prerequisites.sh" "$@"
        ;;
    context)
        "$SCRIPT_DIR/update-agent-context.sh" "$@"
        ;;
    help|--help|-h)
        print_help
        exit 0
        ;;
    *)
        echo "ERROR: Unknown command '$COMMAND'" >&2
        echo "Run 'speckit help' for usage information" >&2
        exit 1
        ;;
esac
