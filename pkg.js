var fs=require('fs')  
var c=''  
c+='{'  
c+='\"name\":\"whiteboard-alasar-jadeed\",'  
c+='\"version\":\"1.0.0\",'  
c+='\"description\":\"Interactive digital whiteboard for AL ASAR JADEED\",'  
c+='\"main\":\"server/index.js\",'  
c+='\"scripts\":{\"start\":\"node server/index.js\",\"client\":\"cd client && npm start\",\"dev\":\"concurrently npm start npm run client\",\"install:all\":\"npm install && cd client && npm install\"},'  
c+='\"author\":\"AL ASAR JADEED\",'  
c+='\"license\":\"MIT\",'  
c+='\"dependencies\":{\"express\":\"^4.18.2\",\"socket.io\":\"^4.6.1\",\"cors\":\"^2.8.5\",\"qrcode\":\"^1.5.3\"},'  
c+='\"devDependencies\":{\"concurrently\":\"^8.2.2\"}'  
c+='}'  
fs.writeFileSync('package.json',c)  
