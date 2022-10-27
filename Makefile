SHELL=/bin/bash

DIR=$(shell basename $$(pwd))
ADDON ?= "@eeacms/volto-addon-template"

# We like colors
# From: https://coderwall.com/p/izxssa/colored-makefile-for-golang-projects
RED=`tput setaf 1`
GREEN=`tput setaf 2`
RESET=`tput sgr0`
YELLOW=`tput setaf 3`

project:
	npm install -g yo
	npm install -g @plone/generator-volto
	npm install -g mrs-developer
	yo @plone/volto project --addon ${ADDON} --workspace "src/addons/${DIR}" --no-interactive
	ln -sf $$(pwd) project/src/addons/
	cp .project.eslintrc.js .eslintrc.js
	cd project && yarn
	@echo "-------------------"
	@echo "$(GREEN)Volto project is ready!$(RESET)"
	@echo "$(RED)Now run: cd project && yarn start$(RESET)"

all: project

.PHONY: start-test-backend
start-test-backend: ## Start Test Plone Backend
	@echo "$(GREEN)==> Start Test Plone Backend$(RESET)"
	docker run -i --rm -e ZSERVER_HOST=0.0.0.0 -e ZSERVER_PORT=55001 -p 55001:55001 -e SITE=plone -e APPLY_PROFILES=plone.app.contenttypes:plone-content,plone.restapi:default,kitconcept.volto:default-homepage -e CONFIGURE_PACKAGES=plone.app.contenttypes,plone.restapi,kitconcept.volto,kitconcept.volto.cors -e ADDONS='plone.app.robotframework plone.app.contenttypes plone.restapi kitconcept.volto' plone ./bin/robot-server plone.app.robotframework.testing.PLONE_ROBOT_TESTING

.PHONY: start-backend-docker
start-backend-docker:		## Starts a Docker-based backend
	@echo "$(GREEN)==> Start Docker-based Plone Backend$(RESET)"
	docker run -it --rm --name=plone -p 8080:8080 -e SITE=Plone -e ADDONS="kitconcept.volto" -e ZCML="kitconcept.volto.cors" plone

.PHONY: test
test:
	docker pull plone/volto-addon-ci:alpha
	docker run -it --rm -e NAMESPACE="@eeacms" -e GIT_NAME="${DIR}" -e RAZZLE_JEST_CONFIG=jest-addon.config.js -v "$$(pwd):/opt/frontend/my-volto-project/src/addons/${DIR}" -e CI="true" plone/volto-addon-ci:alpha

.PHONY: test-update
test-update:
	docker pull plone/volto-addon-ci:alpha
	docker run -it --rm -e NAMESPACE="@eeacms" -e GIT_NAME="${DIR}" -e RAZZLE_JEST_CONFIG=jest-addon.config.js -v "$$(pwd):/opt/frontend/my-volto-project/src/addons/${DIR}" -e CI="true" plone/volto-addon-ci:alpha yarn test src/addons/${DIR}/src --watchAll=false -u

.PHONY: help
help:           ## Show this help.
        @echo -e "$$(grep -hE '^\S+:.*##' $(MAKEFILE_LIST) | sed -e 's/:.*##\s*/:/' -e 's/^\(.\+\):\(.*\)/\\x1b[36m\1\\x1b[m:\2/' | column -c2 -t -s :)"


ifeq ($(wildcard ./project),)
  NODE_MODULES = "../../../node_modules"
else
  NODE_MODULES = "./project/node_modules"
endif

.PHONY: stylelint
stylelint:
	$(NODE_MODULES)/stylelint/bin/stylelint.js --allow-empty-input 'src/**/*.{css,less}'

.PHONY: stylelint-overrides
stylelint-overrides:
	$(NODE_MODULES)/.bin/stylelint --syntax less --allow-empty-input 'theme/**/*.overrides' 'src/**/*.overrides'

.PHONY: stylelint-fix
stylelint-fix:
	$(NODE_MODULES)/stylelint/bin/stylelint.js --allow-empty-input 'src/**/*.{css,less}' --fix
	$(NODE_MODULES)/.bin/stylelint --syntax less --allow-empty-input 'theme/**/*.overrides' 'src/**/*.overrides' --fix

.PHONY: prettier
prettier:
	$(NODE_MODULES)/.bin/prettier --single-quote --check 'src/**/*.{js,jsx,json,css,less,md}'

.PHONY: prettier-fix
prettier-fix:
	$(NODE_MODULES)/.bin/prettier --single-quote  --write 'src/**/*.{js,jsx,json,css,less,md}'

.PHONY: lint
lint:
	$(NODE_MODULES)/eslint/bin/eslint.js --max-warnings=0 'src/**/*.{js,jsx}'

.PHONY: lint-fix
lint-fix:
	$(NODE_MODULES)/eslint/bin/eslint.js --fix 'src/**/*.{js,jsx}'

.PHONY: i18n
i18n:
	rm -rf build/messages
	NODE_ENV=development $(NODE_MODULES)/.bin/i18n --addon

.PHONY: cypress-run
cypress-run:
	NODE_ENV=development  $(NODE_MODULES)/cypress/bin/cypress run

.PHONY: cypress-open
cypress-open:
	NODE_ENV=development  $(NODE_MODULES)/cypress/bin/cypress open
