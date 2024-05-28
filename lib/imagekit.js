// SDK initialization

var ImageKit = require("imagekit");

var imagekit = new ImageKit({
    publicKey : "public_w7WF9jX1zZKNcO8yLNapMzPenqc=",
    privateKey : "private_1iCQzAzDXYA33IpBYENrGUk0iIk=",
    urlEndpoint : "https://ik.imagekit.io/96v3ucrbi"
});

module.exports = imagekit;