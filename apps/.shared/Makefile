.ONESHELL:

npm.publish:
	git add .
	git commit -m "update shared module"
	npm version patch
	npm run clean
	npm run build
	npm publish
