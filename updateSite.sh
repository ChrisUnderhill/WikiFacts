OLD_PACKAGE_ID=$(git rev-parse HEAD:package.json)

git pull

NEW_PACKAGE_ID=$(git rev-parse HEAD:package.json)
[ $OLD_PACKAGE_ID = $NEW_PACKAGE_ID ] || npm install

npm run-script build

pm2 restart server.js
