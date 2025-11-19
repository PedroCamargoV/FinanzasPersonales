#!/usr/bin/env bash

# Initialize Specify project structure with all necessary directories and templates
#
# This script creates the complete Specify project structure including:
# - Core specification directories
# - Template files for specs, plans, tasks
# - Configuration files
# - Script directory structure
#
# Usage: ./speckit-init.sh [OPTIONS]
#
# OPTIONS:
#   --force             Overwrite existing files
#   --with-git          Initialize as a Git repository
#   --help, -h          Show help message

set -e

# Parse command line arguments
FORCE=false
WITH_GIT=false

for arg in "$@"; do
    case "$arg" in
        --force)
            FORCE=true
            ;;
        --with-git)
            WITH_GIT=true
            ;;
        --help|-h)
            cat << 'EOF'
Usage: ./speckit-init.sh [OPTIONS]

Initialize Specify project structure with all necessary directories and templates.

OPTIONS:
  --force             Overwrite existing files (dangerous, use with caution)
  --with-git          Initialize as a Git repository
  --help, -h          Show this help message

EXAMPLES:
  # Initialize new Specify project
  ./speckit-init.sh
  
  # Initialize with Git support
  ./speckit-init.sh --with-git
  
  # Force reinitialize (careful!)
  ./speckit-init.sh --force
  
EOF
            exit 0
            ;;
        *)
            echo "ERROR: Unknown option '$arg'. Use --help for usage information." >&2
            exit 1
            ;;
    esac
done

# Get current directory (assume script is in .specify/scripts/bash)
SCRIPT_DIR="$(CDPATH="" cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"

# Helper functions
info() { echo "ℹ  $1"; }
success() { echo "✓ $1"; }
error() { echo "✗ $1" >&2; }
warn() { echo "⚠  $1"; }

# Create directory if not exists
ensure_dir() {
    local dir="$1"
    if [[ ! -d "$dir" ]]; then
        mkdir -p "$dir"
        success "Created directory: $dir"
    fi
}

# Check if repository is already initialized
if [[ -d "$REPO_ROOT/.specify" ]] && [[ ! "$FORCE" == "true" ]]; then
    warn "Specify project already initialized at $REPO_ROOT"
    info "Use --force to reinitialize"
    exit 0
fi

info "Initializing Specify project structure at $REPO_ROOT"
echo

# Create core directories
info "Creating core directories..."
ensure_dir "$REPO_ROOT/specs"
ensure_dir "$REPO_ROOT/.specify/templates"
ensure_dir "$REPO_ROOT/.specify/scripts/bash"
ensure_dir "$REPO_ROOT/.specify/memory"
echo

# Initialize Git if requested
if [[ "$WITH_GIT" == "true" ]]; then
    if [[ -d "$REPO_ROOT/.git" ]]; then
        warn "Git repository already exists"
    else
        cd "$REPO_ROOT"
        git init
        success "Initialized Git repository"
        
        # Create .gitignore if needed
        if [[ ! -f "$REPO_ROOT/.gitignore" ]]; then
            cat > "$REPO_ROOT/.gitignore" << 'GITIGNORE'
# Dependencies
node_modules/
/.venv
env/
venv/

# Build artifacts
dist/
build/
*.egg-info/

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*
GITIGNORE
            success "Created .gitignore"
        fi
    fi
fi
echo

# Create template files
info "Creating template files..."

# Spec template
cat > "$REPO_ROOT/.specify/templates/spec-template.md" << 'SPEC_TEMPLATE'
# Specification Template

## Overview
**Feature Number**: [FEATURE_NUM]  
**Status**: Draft  
**Created**: [DATE]  
**Owner**: [OWNER]  

Brief description of what this feature accomplishes.

## Problem Statement
What problem does this solve?

## Goals
- Goal 1
- Goal 2
- Goal 3

## Success Criteria
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

## Detailed Requirements

### Functional Requirements
- FR1: Description
- FR2: Description

### Non-Functional Requirements
- NFR1: Performance target
- NFR2: Scalability requirement

## Acceptance Tests
```
Given [context]
When [action]
Then [result]
```

## Open Questions
- Question 1?
- Question 2?

## References
- Link 1
- Link 2
SPEC_TEMPLATE

success "Created spec template"

# Plan template
cat > "$REPO_ROOT/.specify/templates/plan-template.md" << 'PLAN_TEMPLATE'
# Implementation Plan Template

## Metadata
**Language/Version**: [e.g., Python 3.11]  
**Primary Dependencies**: [e.g., FastAPI, SQLAlchemy]  
**Storage**: [e.g., PostgreSQL, MongoDB, LocalStorage]  
**Project Type**: [e.g., API, Web App, Library]  
**Estimated Hours**: [e.g., 40]  

## Architecture Decision
[Explain the high-level architecture and why these choices were made]

## Development Phases

### Phase 1: [Phase Name]
**Duration**: [hours]  
**Deliverables**:
- [ ] Task 1
- [ ] Task 2
- [ ] Task 3

**Exit Criteria**:
- Criterion 1
- Criterion 2

### Phase 2: [Phase Name]
**Duration**: [hours]  
**Deliverables**:
- [ ] Task 1
- [ ] Task 2

**Exit Criteria**:
- Criterion 1

## Risk Mitigation
| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|-----------|
| Risk 1 | High | High | Action |
| Risk 2 | Medium | Medium | Action |

## Testing Strategy
- Unit tests: [coverage target]
- Integration tests: [scope]
- E2E tests: [scope]

## Deployment Notes
[Any special considerations for deployment]

## Rollback Plan
[How to quickly rollback if needed]
PLAN_TEMPLATE

success "Created plan template"

# Tasks template
cat > "$REPO_ROOT/.specify/templates/tasks-template.md" << 'TASKS_TEMPLATE'
# Task List

## Overview
[High-level summary of work]

## Tasks

### 1. Task Name
**Status**: Not Started  
**Priority**: P1  
**Story Points**: 5  
**Owner**: [Name]  

**Acceptance Criteria**:
- [ ] Criterion 1
- [ ] Criterion 2

**Dependencies**: None

**Notes**: Additional context

### 2. Task Name
**Status**: Not Started  
**Priority**: P1  
**Story Points**: 8  
**Owner**: [Name]  

**Acceptance Criteria**:
- [ ] Criterion 1
- [ ] Criterion 2

**Dependencies**: Task 1

---

## Summary
- Total Tasks: [N]
- Total Story Points: [N]
- Estimated Duration: [N] days
TASKS_TEMPLATE

success "Created tasks template"

# Agent file template
cat > "$REPO_ROOT/.specify/templates/agent-file-template.md" << 'AGENT_TEMPLATE'
# Project Context for AI Agents

**Project**: [PROJECT NAME]  
**Last updated**: [DATE]  
**Status**: Active Development  

## 🎯 Project Overview
[PROJECT_NAME] is a development project using [EXTRACTED FROM ALL PLAN.MD FILES].

## 📁 Project Structure
```
[ACTUAL STRUCTURE FROM PLANS]
```

## 🛠 Technology Stack
- **Primary**: [EXTRACTED FROM ALL PLAN.MD FILES]

## 📋 Current Development
Focus on implementing core features with emphasis on:
- Code quality and testing
- Documentation
- Performance optimization

## 🔧 Build and Test Commands
```bash
[ONLY COMMANDS FOR ACTIVE TECHNOLOGIES]
```

## 📚 Key Guidelines
- [LANGUAGE-SPECIFIC, ONLY FOR LANGUAGES IN USE]
- Write tests for all new features
- Update documentation with changes
- Follow existing code patterns

## 🚀 Recent Changes
[LAST 3 FEATURES AND WHAT THEY ADDED]

## 📞 Important Notes
- Always check existing specs before starting new work
- Reference feature branches in commits
- Update this file when technology stack changes
- Run full test suite before submitting PRs

---

**Next Steps**: Check specs/ for feature details and plans/
AGENT_TEMPLATE

success "Created agent file template"

# Constitution template (if not exists)
if [[ ! -f "$REPO_ROOT/.specify/memory/constitution.md" ]]; then
    cat > "$REPO_ROOT/.specify/memory/constitution.md" << 'CONSTITUTION_TEMPLATE'
# Project Constitution
<!-- This file defines the core principles and rules for this project -->

## Core Principles

### I. Clarity First
All decisions prioritize clarity and simplicity over cleverness.

### II. Testing Required
No feature is complete without tests. TDD when possible.

### III. Documentation Matters
Code is read more than written. Document complex decisions.

### IV. Communication
Clear commit messages, PR descriptions, and code comments.

## Development Standards

### Branching
- Feature branches: `###-feature-name` (numeric prefix required)
- Main branch: `main` or `master`
- Always branch from `main`

### Commits
- Clear, descriptive messages
- One logical change per commit
- Reference feature numbers: `[###] Add feature X`

### Code Quality
- Follow language conventions
- Use linters and formatters
- Maintain 80%+ test coverage

### Pull Requests
- Link to related issues
- Describe changes and rationale
- Require code review before merge

## Project Governance
This constitution supersedes all other guidelines. Amendments require documentation and approval.

**Version**: 1.0  
**Adopted**: [TODAY]  
**Last Amended**: [TODAY]  
CONSTITUTION_TEMPLATE

    success "Created project constitution"
fi

echo
success "✨ Specify project initialization complete!"
echo
info "Next steps:"
echo "  1. Create first feature: .specify/scripts/bash/create-new-feature.sh 'Your feature description'"
echo "  2. Write specification: Edit specs/###-feature-name/spec.md"
echo "  3. Create implementation plan: .specify/scripts/bash/setup-plan.sh"
echo "  4. Start development!"
echo
info "For more info: .specify/scripts/bash/check-prerequisites.sh --help"
