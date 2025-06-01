
# Improved Makefile for Full-Stack Operations
.PHONY: help install dev build start test lint format clean logs status migrate seed

# Variables and directories
BACKEND_DIR := apps/backend
FRONTEND_DIR := apps/frontend
PACKAGES_DIR := packages

# Default target
help: ## Show this help message
	@echo "Music App Development Makefile"
	@echo ""
	@echo "Available commands:"
	@grep -E '^[a-zA-Z_:-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  %-25s %s\n", $$1, $$2}'

# =============================================================================
# BACKEND COMMANDS
# =============================================================================

backend_install: ## Install backend dependencies
	@cd $(BACKEND_DIR) && deno cache --reload deno.json

backend_dev: ## Start backend development server
	@cd $(BACKEND_DIR) && deno task dev

backend_start: ## Start backend production server
	@cd $(BACKEND_DIR) && deno task start

backend_build: ## Build backend application
	@cd $(BACKEND_DIR) && deno task build

backend_test: ## Run backend tests
	@cd $(BACKEND_DIR) && deno test

backend_lint: ## Lint backend code
	@cd $(BACKEND_DIR) && deno lint

backend_format: ## Format backend code
	@cd $(BACKEND_DIR) && deno fmt

backend_check: ## Type check backend code
	@cd $(BACKEND_DIR) && deno check **/*.ts

backend_clean: ## Clean backend cache and temporary files
	@cd $(BACKEND_DIR) && deno cache --reload deno.json
	@find $(BACKEND_DIR) -name "*.tmp" -delete 2>/dev/null || true
	@find $(BACKEND_DIR) -name ".DS_Store" -delete 2>/dev/null || true

backend_logs: ## Show backend logs
	@cd $(BACKEND_DIR) && tail -f logs/*.log 2>/dev/null || echo "No log files found"

backend_compile: ## Compile backend to binary
	@cd $(BACKEND_DIR) && deno compile --allow-all --output bin/backend main.ts

backend_deps_update: ## Update backend dependencies
	@cd $(BACKEND_DIR) && deno cache --reload deno.json

backend_env_setup: ## Setup backend environment files
	@if [ ! -f $(BACKEND_DIR)/.env ]; then \
		if [ -f $(BACKEND_DIR)/.env.example ]; then \
			cp $(BACKEND_DIR)/.env.example $(BACKEND_DIR)/.env; \
			echo "Backend .env created"; \
		fi; \
	fi

# =============================================================================
# FRONTEND COMMANDS
# =============================================================================

frontend_install: ## Install frontend dependencies
	@cd $(FRONTEND_DIR) && deno cache --reload deno.json

frontend_dev: ## Start frontend development server
	@cd $(FRONTEND_DIR) && deno task dev

frontend_start: ## Start frontend production server
	@cd $(FRONTEND_DIR) && deno task start

frontend_build: ## Build frontend application
	@cd $(FRONTEND_DIR) && deno task build

frontend_preview: ## Preview built frontend
	@cd $(FRONTEND_DIR) && deno task preview

frontend_test: ## Run frontend tests
	@cd $(FRONTEND_DIR) && deno task test

frontend_lint: ## Lint frontend code
	@cd $(FRONTEND_DIR) && deno lint

frontend_format: ## Format frontend code
	@cd $(FRONTEND_DIR) && deno fmt

frontend_check: ## Type check frontend code
	@cd $(FRONTEND_DIR) && deno check **/*.ts

frontend_clean: ## Clean frontend cache and temporary files
	@cd $(FRONTEND_DIR) && deno cache --reload deno.json
	@find $(FRONTEND_DIR) -name "*.tmp" -delete 2>/dev/null || true
	@find $(FRONTEND_DIR) -name ".DS_Store" -delete 2>/dev/null || true
	@rm -rf $(FRONTEND_DIR)/dist $(FRONTEND_DIR)/.vite 2>/dev/null || true

frontend_deps_update: ## Update frontend dependencies
	@cd $(FRONTEND_DIR) && deno cache --reload deno.json

frontend_env_setup: ## Setup frontend environment files
	@if [ ! -f $(FRONTEND_DIR)/.env ]; then \
		if [ -f $(FRONTEND_DIR)/.env.example ]; then \
			cp $(FRONTEND_DIR)/.env.example $(FRONTEND_DIR)/.env; \
			echo "Frontend .env created"; \
		fi; \
	fi

# =============================================================================
# DATABASE & SUPABASE COMMANDS
# =============================================================================

supabase_start: ## Start Supabase local development
	@cd $(BACKEND_DIR) && supabase start

supabase_stop: ## Stop Supabase local development
	@cd $(BACKEND_DIR) && supabase stop

supabase_status: ## Check Supabase status
	@cd $(BACKEND_DIR) && supabase status

supabase_reset: ## Reset Supabase local database
	@cd $(BACKEND_DIR) && supabase db reset

supabase_functions: ## Serve Supabase functions locally
	@cd $(BACKEND_DIR) && supabase functions serve

db_migrate: ## Run database migrations
	@cd $(BACKEND_DIR) && supabase db reset

db_migrate_up: ## Apply pending migrations
	@cd $(BACKEND_DIR) && supabase migration up

db_migrate_new: ## Create new migration (usage: make db_migrate_new NAME=migration_name)
	@cd $(BACKEND_DIR) && supabase migration new $(NAME)

db_seed: ## Seed the database
	@cd $(BACKEND_DIR) && supabase db reset --seed

db_backup: ## Backup database
	@cd $(BACKEND_DIR) && supabase db dump > backup_$$(date +%Y%m%d_%H%M%S).sql

# =============================================================================
# PACKAGES COMMANDS
# =============================================================================

packages_install: ## Install shared packages dependencies
	@cd $(PACKAGES_DIR)/shared && deno cache --reload deno.json

packages_test: ## Run shared packages tests
	@cd $(PACKAGES_DIR)/shared && deno test

packages_lint: ## Lint shared packages code
	@cd $(PACKAGES_DIR)/shared && deno lint

packages_format: ## Format shared packages code
	@cd $(PACKAGES_DIR)/shared && deno fmt

packages_check: ## Type check shared packages code
	@cd $(PACKAGES_DIR)/shared && deno check **/*.ts

packages_clean: ## Clean shared packages cache
	@cd $(PACKAGES_DIR)/shared && deno cache --reload deno.json

packages_deps_update: ## Update shared packages dependencies
	@cd $(PACKAGES_DIR)/shared && deno cache --reload deno.json

# =============================================================================
# DOCKER COMMANDS
# =============================================================================

docker_build_backend: ## Build backend Docker image
	@docker build -t music-backend -f $(BACKEND_DIR)/Dockerfile $(BACKEND_DIR)

docker_build_frontend: ## Build frontend Docker image
	@docker build -t music-frontend -f $(FRONTEND_DIR)/Dockerfile $(FRONTEND_DIR)

docker_run_backend: ## Run backend Docker container
	@docker run -p 8000:8000 music-backend

docker_run_frontend: ## Run frontend Docker container
	@docker run -p 3000:3000 music-frontend

docker_stop: ## Stop all Docker containers
	@docker stop $$(docker ps -q --filter ancestor=music-backend) 2>/dev/null || true
	@docker stop $$(docker ps -q --filter ancestor=music-frontend) 2>/dev/null || true

# =============================================================================
# COMBINED COMMANDS
# =============================================================================

install: backend_install frontend_install packages_install ## Install all dependencies

dev: ## Start both frontend and backend in parallel
	@trap 'kill %1 %2 2>/dev/null || true' EXIT; \
	$(MAKE) backend_dev & \
	sleep 3 && \
	$(MAKE) frontend_dev & \
	wait

build: backend_build frontend_build ## Build all applications

test: backend_test frontend_test packages_test ## Run all tests

lint: backend_lint frontend_lint packages_lint ## Lint all code

format: backend_format frontend_format packages_format ## Format all code

check: backend_check frontend_check packages_check ## Type check all code

clean: backend_clean frontend_clean packages_clean ## Clean all cache and temporary files

deps_update: backend_deps_update frontend_deps_update packages_deps_update ## Update all dependencies

env_setup: backend_env_setup frontend_env_setup ## Setup all environment files

# =============================================================================
# UTILITY COMMANDS
# =============================================================================

status: ## Show application status
	@echo "Deno Processes:"
	@ps aux | grep -i deno | grep -v grep || echo "No Deno processes running"
	@echo "Supabase Status:"
	@cd $(BACKEND_DIR) && supabase status 2>/dev/null || echo "Supabase not running"

monitor: ## Monitor application performance
	@while true; do \
		echo "$$(date): $$(ps aux | grep deno | grep -v grep | wc -l) Deno processes running"; \
		sleep 5; \
	done

# =============================================================================
# QUICK COMMANDS
# =============================================================================

quick_start: env_setup supabase_start dev ## Quick start: setup env, start Supabase, and run both servers

quick_test: lint format test ## Quick test: lint, format, and run all tests

quick_build: build ## Quick build: build all applications

deploy_check: lint test build ## Check if ready for deployment

fresh_start: clean install quick_start ## Fresh start: clean everything, install, and start

reset_project: ## Reset project to clean state
	@read -p "Remove all .env files and clean caches? (y/N): " confirm && [ "$$confirm" = "y" ] || exit 1
	@rm -f $(BACKEND_DIR)/.env $(FRONTEND_DIR)/.env
	@$(MAKE) clean