build:
	npm run build
	rm -rf docs/
	mv out/ docs/
	echo "compare.iwanalabs.com" > docs/CNAME
	echo 'true' > docs/.nojekyll
