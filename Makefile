##############################################################################
# Run:
#    make
#    make start
#
# Go to:
#
#     http://localhost:3000
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
DIR=$(shell basename $$(pwd))
NODE_MODULES?="../../../node_modules"
PLONE_VERSION?=6
VOLTO_VERSION?=16
ADDON_PATH="${DIR}"
ADDON_NAME="@eeacms/${ADDON_PATH}"
DOCKER_COMPOSE=PLONE_VERSION=${PLONE_VERSION} VOLTO_VERSION=${VOLTO_VERSION} ADDON_NAME=${ADDON_NAME} ADDON_PATH=${ADDON_PATH} docker compose
RAZZLE_INTERNAL_API_PATH?="http://localhost:8080/Plone"
RAZZLE_DEV_PROXY_API_PATH?="${RAZZLE_INTERNAL_API_PATH}"
CYPRESS_API_PATH="${RAZZLE_DEV_PROXY_API_PATH}"



# Top-level targets
.PHONY: all
all: clean install

.PHONY: clean
clean:			## Cleanup development environment
	${DOCKER_COMPOSE} down --volumes --remove-orphans

.PHONY: install
install:		## Build and install development environment
	echo "Running:	${DOCKER_COMPOSE} build"
	${DOCKER_COMPOSE} pull
	${DOCKER_COMPOSE} build

.PHONY: start
start:			## Start development environment
	echo "Running:	${DOCKER_COMPOSE} up"
	${DOCKER_COMPOSE} up

.PHONY: shell
shell:			## Start a shell in the frontend container
	echo "Running:	${DOCKER_COMPOSE} run frontend bash"
	${DOCKER_COMPOSE} run --entrypoint=bash frontend

.PHONY: cypress-open
cypress-open:		## Open cypress integration tests
	CYPRESS_API_PATH="${RAZZLE_DEV_PROXY_API_PATH}" NODE_ENV=development  $(NODE_MODULES)/cypress/bin/cypress open

.PHONY: cypress-run
cypress-run:	## Run cypress integration tests
	CYPRESS_API_PATH="${RAZZLE_DEV_PROXY_API_PATH}" NODE_ENV=development  $(NODE_MODULES)/cypress/bin/cypress run --browser chromium

.PHONY: test
test:			## Run jest tests
	${DOCKER_COMPOSE} run -e CI=1 frontend test

.PHONY: test-update
test-update:	## Update jest tests snapshots
	${DOCKER_COMPOSE} run -e CI=1 frontend test -u

.PHONY: stylelint
stylelint:		## Stylelint
	$(NODE_MODULES)/stylelint/bin/stylelint.js --allow-empty-input 'src/**/*.{css,less}'

.PHONY: stylelint-overrides
stylelint-overrides:
	$(NODE_MODULES)/.bin/stylelint --custom-syntax less --allow-empty-input 'theme/**/*.overrides' 'src/**/*.overrides'

.PHONY: stylelint-fix
stylelint-fix:	## Fix stylelint
	$(NODE_MODULES)/stylelint/bin/stylelint.js --allow-empty-input 'src/**/*.{css,less}' --fix
	$(NODE_MODULES)/.bin/stylelint --custom-syntax less --allow-empty-input 'theme/**/*.overrides' 'src/**/*.overrides' --fix

.PHONY: prettier
prettier:		## Prettier
	$(NODE_MODULES)/.bin/prettier --single-quote --check 'src/**/*.{js,jsx,json,css,less,md}'

.PHONY: prettier-fix
prettier-fix:	## Fix prettier
	$(NODE_MODULES)/.bin/prettier --single-quote  --write 'src/**/*.{js,jsx,json,css,less,md}'

.PHONY: lint
lint:			## ES Lint
	$(NODE_MODULES)/eslint/bin/eslint.js --max-warnings=0 'src/**/*.{js,jsx}'

.PHONY: lint-fix
lint-fix:		## Fix ES Lint
	$(NODE_MODULES)/eslint/bin/eslint.js --fix 'src/**/*.{js,jsx}'

.PHONY: i18n
i18n:			## i18n
	rm -rf build/messages
	NODE_ENV=development $(NODE_MODULES)/.bin/i18n --addon

.PHONY: help
help:                   ## Show this help.
	@echo -e "$$(grep -hE '^\S+:.*##' $(MAKEFILE_LIST) | sed -e 's/:.*##\s*/:/' -e 's/^\(.\+\):\(.*\)/\\x1b[36m\1\\x1b[m:\2/' | column -c2 -t -s :)"
	head -n 14 Makefile

.PHONY: ci-fix
ci-fix:
	echo "Running lint-fix"
	make lint-fix
	echo "Running prettier-fix"
	make prettier-fix
	echo "Running stylelint-fix"
	make stylelint-fix

.PHONY: test-ci
test-ci:
	cd /app
	RAZZLE_JEST_CONFIG=src/addons/${ADDON_PATH}/jest-addon.config.js CI=true yarn test src/addons/${ADDON_PATH}/src --watchAll=false --reporters=default --reporters=jest-junit --collectCoverage --coverageReporters lcov cobertura text

.PHONY: start-ci
start-ci:
	cp .coverage.babel.config.js /app/babel.config.js
	cd ../..
	yarn start

.PHONY: cypress-ci
cypress-ci:
	$(NODE_MODULES)/.bin/wait-on -t 240000  http://localhost:3000
	NODE_ENV=development make cypress-run

