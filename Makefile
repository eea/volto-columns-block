##############################################################################
# Run:
#    make install
#    make start
#
# Go to:
#
#     http://localhost:3000
#
# Backend:
#
#    make backend-docker-start
#
# Cypress:
#
#    make cypress-open
#
##############################################################################
# SETUP MAKE
#
## Defensive settings for make: https://tech.davis-hansson.com/p/make/
SHELL:=bash
.ONESHELL:
# for Makefile debugging purposes add -x to the .SHELLFLAGS
.SHELLFLAGS:=-eu -o pipefail -O inherit_errexit -c
.SILENT:
.DELETE_ON_ERROR:
MAKEFLAGS+=--warn-undefined-variables
MAKEFLAGS+=--no-builtin-rules

# Colors
# OK=Green, warn=yellow, error=red
ifeq ($(TERM),)
# no colors if not in terminal
        MARK_COLOR=
        OK_COLOR=
        WARN_COLOR=
        ERROR_COLOR=
        NO_COLOR=
else
        MARK_COLOR=`tput setaf 6`
        OK_COLOR=`tput setaf 2`
        WARN_COLOR=`tput setaf 3`
        ERROR_COLOR=`tput setaf 1`
        NO_COLOR=`tput sgr0`
endif

##############################################################################
# SETTINGS AND VARIABLE
CURRENT_DIR:=$(shell dirname $(realpath $(lastword $(MAKEFILE_LIST))))
RAZZLE_INTERNAL_API_PATH?=http://localhost:8080/Plone
export RAZZLE_INTERNAL_API_PATH


# Top-level targets
.PHONY: all
all: help

.PHONY: clean
clean:			## Cleanup development environment
	docker compose down --volumes --remove-orphans
	rm -rf core node_modules

.PHONY: install
install:		## Install development environment
	pnpm dlx mrs-developer missdev --no-config --fetch-https
	pnpm i
	make build-deps

.PHONY: start
start:			## Start backend and Volto frontend
	docker compose up -d backend
	pnpm start

.PHONY: backend-docker-start
backend-docker-start:	## Start Plone backend on port 8080
	docker compose up backend

.PHONY: build
build:			## Build production bundle
	pnpm build

.PHONY: build-deps
build-deps:		## Build Volto dependencies
	pnpm --filter @plone/registry --filter @plone/components build

.PHONY: cypress-open
CYPRESS_SPEC_PATTERN=$(CURRENT_DIR)/cypress/tests/**/*.{js,jsx,ts,tsx}

cypress-open:		## Open Cypress interactive runner
	pnpm --filter @plone/volto exec cypress open --project $(CURRENT_DIR) --config-file $(CURRENT_DIR)/cypress.config.js --config specPattern='$(CYPRESS_SPEC_PATTERN)' --env API_PATH="$(RAZZLE_INTERNAL_API_PATH)"

.PHONY: cypress-run
cypress-run:		## Run Cypress tests headless
	pnpm --filter @plone/volto exec cypress run --project $(CURRENT_DIR) --config-file $(CURRENT_DIR)/cypress.config.js --config specPattern='$(CYPRESS_SPEC_PATTERN)' --env API_PATH="$(RAZZLE_INTERNAL_API_PATH)"

.PHONY: cypress
cypress: cypress-run	## Run Cypress tests headless

.PHONY: test
test:			## Run unit tests
	pnpm test

.PHONY: i18n
i18n:			## Extract and compile translations
	pnpm i18n

.PHONY: lint
lint:			## ESLint check
	pnpm lint

.PHONY: lint-fix
lint-fix:		## ESLint fix
	pnpm lint:fix

.PHONY: prettier
prettier:		## Prettier check
	pnpm prettier

.PHONY: prettier-fix
prettier-fix:		## Prettier fix
	pnpm prettier:fix

.PHONY: stylelint
stylelint:		## Stylelint check
	pnpm stylelint

.PHONY: stylelint-fix
stylelint-fix:		## Stylelint fix
	pnpm stylelint:fix

.PHONY: ci-fix
ci-fix:			## Fix code style (used by CI)
	pnpm lint:fix
	pnpm prettier:fix
	pnpm stylelint:fix

.PHONY: test-ci
test-ci:		## Run unit tests in CI
	VOLTOCONFIG=$(CURRENT_DIR)/volto.config.js pnpm --filter @plone/volto i18n
	CI=1 pnpm run test --passWithNoTests --coverage --coverage.reporter=lcov --coverage.reporter=text --reporter=junit --outputFile=junit.xml

.PHONY: start-ci
start-ci:		## Start frontend in production mode (used by CI)
	pnpm build && pnpm start:prod

.PHONY: check-ci
check-ci:		## Wait for frontend to be ready
	@timeout 600 bash -c 'until (echo > /dev/tcp/localhost/3000) 2>/dev/null; do sleep 2; done'

.PHONY: cypress-ci
cypress-ci:		## Run Cypress tests headless (used by CI)
	pnpm --filter @plone/volto exec cypress run --project $(CURRENT_DIR) --config-file $(CURRENT_DIR)/cypress.config.js --config specPattern='$(CYPRESS_SPEC_PATTERN)' --env API_PATH="$(RAZZLE_INTERNAL_API_PATH)" --browser chromium

.PHONY: help
help:			## Show this help.
	@echo -e "$$(grep -hE '^\S+:.*##' $(MAKEFILE_LIST) | sed -e 's/:.*##\s*/:/' -e 's/^\(.\+\):\(.*\)/\\x1b[36m\1\\x1b[m:\2/' | column -c2 -t -s :)"
	@head -n 18 Makefile
