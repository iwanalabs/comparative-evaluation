deploy:
	npm run build
	cd out
	git checkout -b gh-pages
	git add .
	git commit -m "Deploy"
	git push -u origin gh-pages --force
