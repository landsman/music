WEB := src/web

##
## Code quality
##
.PHONY:  format lint

format:
	deno task format

lint:
	deno task lint

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

