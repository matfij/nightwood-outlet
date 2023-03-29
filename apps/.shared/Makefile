.ONESHELL:

npm.publish:
	git add .
	git commit -m "version update"
	npm version patch
	npm run clean
	npm run build
	npm publish
