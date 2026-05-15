//storage.services.js

//jitni bhi 3rd party servecis hain (jasa abhi hum ImageKit ki cloud storage service istamal kar raha hain lakin feature ma hum iski jagha AWS ka use karain on basis of anything benefitting me in temrs of pricing or what ever there are multiple providers) jinko hum feature ma change kar sakta hain based on convenianceand need in sab ka code hum is folder ma likhta hain

// jasa ab koi ai ki service chahiya to proders ma sa google ha ,deepseek,anthropic,openai etc ya sab ai ki service provide karta han in masa hum kisi ka bhi istamal kar sakta hain --> ab iska code bhi isi folder ma ai.service,js file ma phir hoga

//in summry asi service jisko ap kabhi bhi change karsakta ho wo jati ha service folder ma jay gi

const ImageKit = require("imagekit");

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

async function uploadFile(file, fileName) {
  const result = await imagekit.upload({
    file: file, // required
    fileName: fileName, //required
  });

  return result; // return the URL of the uploaded file
}

module.exports = {
  uploadFile,
};
