deploy:
	npm run build
	mv out docs
	git checkout gh-pages
	git add .
	git commit -m "Deploy"
	git push -u origin gh-pages --force
