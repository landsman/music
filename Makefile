WEB := src/web

-include .env
export

guard-DATABASE_URL:
	@[ -n "$(DATABASE_URL)" ] || { echo "Error: DATABASE_URL is not set. Add it to .env or export it."; exit 1; }

##
## Code quality
##
.PHONY:  format lint

format:
	deno task format

lint:
	deno task lint


#
# DOC
#
.PHONY: decision

decision: ## Create a new decision record (usage: make decision, or make decision TITLE="my title")
	@if [ -n "$(TITLE)" ]; then \
		title="$(TITLE)"; \
	else \
		read -p "Title (in English): " title; \
	fi; \
	if [ -z "$$title" ]; then echo "$(RED)Error: title is required$(END)"; exit 1; fi; \
	slug=$$(echo "$$title" | tr '[:upper:]' '[:lower:]' | \
		tr '_' '-' | \
		sed 's/[^a-z0-9 -]//g' | \
		tr ' ' '-' | \
		sed 's/-\{2,\}/-/g; s/^-//; s/-$$//'); \
	last=$$(ls .docs/decision-records/[0-9][0-9][0-9]-*.md 2>/dev/null | sort | tail -1); \
	if [ -z "$$last" ]; then next="001"; \
	else next=$$(basename "$$last" | sed 's/-.*//' | awk '{printf "%03d", $$1 + 1}'); fi; \
	file=".docs/decision-records/$${next}-$${slug}.md"; \
	cp .docs/decision-records/000-TEMPLATE.md "$$file"; \
	basename=$$(basename "$$file"); \
	echo "- [$${next}]($$basename) — $$title" >> .docs/decision-records/README.md; \
	git add "$$file" .docs/decision-records/README.md; \
	echo "$(GREEN)Created: $$file$(END)"; \
	if [ -z "$(TITLE)" ]; then \
		case "$$(uname)" in \
			Darwin) open "$$file" ;; \
			Linux) xdg-open "$$file" ;; \
		esac; \
	fi


##
## Diagnostics
##
DIAG := supabase/diagnostics/egress

.PHONY: diag-check diag-rows diag-avg-rows diag-tables diag-seq-scans diag-active

diag-check: guard-DATABASE_URL ## Check pg_stat_statements extension is enabled
	psql $(DATABASE_URL) -f $(DIAG)/00_check_pg_stat_statements.sql

diag-rows: guard-DATABASE_URL ## Top queries by total rows returned
	psql $(DATABASE_URL) -f $(DIAG)/01_top_queries_by_rows.sql

diag-avg-rows: guard-DATABASE_URL ## Queries with largest result sets per call
	psql $(DATABASE_URL) -f $(DIAG)/02_queries_by_avg_rows.sql

diag-tables: guard-DATABASE_URL ## Large tables: size, row count, index overhead
	psql $(DATABASE_URL) -f $(DIAG)/03_large_tables.sql

diag-seq-scans: guard-DATABASE_URL ## Tables being full-scanned without index use
	psql $(DATABASE_URL) -f $(DIAG)/04_sequential_scans.sql

diag-active: guard-DATABASE_URL ## Live view of currently running queries
	psql $(DATABASE_URL) -f $(DIAG)/05_active_queries.sql


##
## SUPABASE
##
.PHONY: start down serve studio tests

start:
	deno task start

down:
	deno task down

serve:
	deno task serve

studio:
	deno task studio

tests:
	deno task tests

# Database
.PHONY: migration migrate update-types-local update-types-linked

migration:
	deno task migration $(name)

migrate:
	deno task migrate

update-types-local:
	deno task update-types-local

update-types-linked:
	deno task update-types-linked


##
## Web app
##
.PHONY: dev build preview extract compile
dev:
	cd $(WEB) && deno task dev

build:
	cd $(WEB) && deno task build

preview:
	cd $(WEB) && deno task preview

# i18n
extract:
	cd $(WEB) && deno task extract

compile:
	cd s$(WEB) && deno task compile

