OLD_PACKAGE_ID=$(git rev-parse HEAD:package.json)
echo "git pulling"
git pull


NEW_PACKAGE_ID=$(git rev-parse HEAD:package.json)
[ $OLD_PACKAGE_ID = $NEW_PACKAGE_ID ] || echo "npm installing" && npm install

echo "npm running build"
npm run-script build

echo "restarting pm2 server"
pm2 restart wikifacts
