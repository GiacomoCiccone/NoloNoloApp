
# modifica estensione file
cd back-office
find ./ -type f -exec sed -i -e 's,http://localhost:8000,https://site202121.tw.cs.unibo.it,g' {} \;
find ./ -type f -exec sed -i -e 's,components/,../components/,g' {} \;
find ./ -type f -exec sed -i -e 's,style/,../style/,g' {} \;
find ./ -type f -exec sed -i -e 's,scripts/,../scripts/,g' {} \;
find ./ -type f -exec sed -i -e 's,jquery-3.6.0.min.js,../jquery-3.6.0.min.js,g' {} \;
find ./ -type f -exec sed -i -e 's,replace("./login.html"),replace("./back-office/login.html"),g' {} \;
sed -i -e 's,./,./back-office/,g' ./components/sidebar.html 
cd ../dashboard
find ./ -type f -exec sed -i -e 's,http://localhost:8000,https://site202121.tw.cs.unibo.it,g' {} \;
cd ../backend
find ./ -type f -exec sed -i -e 's,http://localhost:3000,https://site202121.tw.cs.unibo.it,g' {} \;
find ./ -type f -exec sed -i -e 's,process.env.PORT,8000,g' {} \;
find ./ -type f -exec sed -i -e 's,process.env.MONGO_URI,"mongodb://site202121:zai2Aith@mongo_site202121?writeConcern=majority",g' {} \;
find ./ -type f -exec sed -i -e 's,process.env.JWT_SECRET,"a10b06f28e540e134aad34498936033c3491b2c0a296594e51b741f26d196b8e71de06",g' {} \;
find ./ -type f -exec sed -i -e 's,process.env.JWT_EXPIRE,"10min",g' {} \;
find ./ -type f -exec sed -i -e 's,process.env.EMAIL_USERNAME,"TW202121@outlook.com",g' {} \;
find ./ -type f -exec sed -i -e 's,process.env.EMAIL_PASSWORD,"da172b715506e1743faa64cbd67a3ef1e98344a8",g' {} \;
find ./ -type f -exec sed -i -e 's,process.env.EMAIL_FROM,"TW202121@outlook.com",g' {} \;

cd ../dashboard
npm install
npm run build
mkdir ../backend/dashboard/
mv dist ../backend/dashboard/dist

cd ../frontend
npm install
npm run build
mkdir ../backend/frontend/
mv build ../backend/frontend/build

mv ../back-office ../backend/back-office

cd ../backend #final step
rsync -av --omit-dir-times --no-perms --exclude 'node_modules' . angelo.galavotti@annina.cs.unibo.it:/home/web/site202121/html/
