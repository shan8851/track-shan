SHELL := /bin/bash
BUN ?= bun
ALLOW_TEST_DB_RESET ?=

.PHONY: help install dev build start lint typecheck test test-watch test-e2e test-all playwright-install db-push db-generate db-migrate db-studio clean-next clean-node-modules clean-lockfile clean-cache clean

help:
	@echo "Common commands:"
	@echo "  make install              Install dependencies"
	@echo "  make dev                  Start Next.js dev server"
	@echo "  make build                Build production app"
	@echo "  make start                Start production server"
	@echo "  make lint                 Run ESLint"
	@echo "  make typecheck            Run TypeScript checks"
	@echo "  make test                 Run unit tests"
	@echo "  make test-watch           Run unit tests in watch mode"
	@echo "  make test-e2e             Run Playwright tests (requires ALLOW_TEST_DB_RESET=true)"
	@echo "  make test-all             Run unit tests, lint, and typecheck"
	@echo "  make playwright-install   Install Playwright Chromium"
	@echo "  make db-push              Push schema to Postgres"
	@echo "  make db-generate          Generate Drizzle migrations"
	@echo "  make db-migrate           Apply Drizzle migrations"
	@echo "  make db-studio            Open Drizzle Studio"
	@echo "  make clean-next           Delete .next"
	@echo "  make clean-node-modules   Delete node_modules"
	@echo "  make clean-lockfile       Delete bun.lock"
	@echo "  make clean-cache          Delete build/test caches"
	@echo "  make clean                Delete .next, node_modules, lockfile, and caches"

install:
	$(BUN) install

dev:
	$(BUN) run dev

build:
	$(BUN) run build

start:
	$(BUN) run start

lint:
	$(BUN) run lint

typecheck:
	$(BUN) run typecheck

test:
	$(BUN) run test

test-watch:
	$(BUN) run test:watch

test-e2e:
	@if [ "$(ALLOW_TEST_DB_RESET)" != "true" ]; then \
		echo "Set ALLOW_TEST_DB_RESET=true to run e2e tests safely."; \
		exit 1; \
	fi
	@if [ -z "$$TEST_DATABASE_URL" ] && [ -z "$$TEST_DATABASE_URL_DIRECT" ]; then \
		echo "Set TEST_DATABASE_URL or TEST_DATABASE_URL_DIRECT before running e2e tests."; \
		exit 1; \
	fi
	ALLOW_TEST_DB_RESET=true $(BUN) run test:e2e

test-all: test lint typecheck

playwright-install:
	$(BUN) run playwright:install

db-push:
	$(BUN) run db:push

db-generate:
	$(BUN) run db:generate

db-migrate:
	$(BUN) run db:migrate

db-studio:
	$(BUN) run db:studio

clean-next:
	rm -rf .next

clean-node-modules:
	rm -rf node_modules

clean-lockfile:
	rm -f bun.lock

clean-cache:
	rm -rf playwright-report test-results coverage

clean: clean-next clean-node-modules clean-lockfile clean-cache
