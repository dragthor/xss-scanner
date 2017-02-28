var { stringFormat } = require('./util')

const http = require("http");
const fs = require("fs");
const uuid = require("node-uuid");
const readline = require("readline");
const chalk = require("chalk");

const xssOptions = {
    // Proxy Config - one example, watch req/res through Fiddler.
    // proxy: {
    //     host: "127.0.0.1",
    //     port: 8888
    // },

    fileOutput: false,
    host: "www.yourwebsite.com",
    port: 80,
    path: "/special.plp?page={0}",
    method: "POST",
    protocol: "http:",
    postData: "paramName1=paramValue1&paramName2=paramValue2"
};

const payloadFileReader = readline.createInterface({
    input: fs.createReadStream("data/payload.txt")
});

payloadFileReader.on("line", (line) => {
    if (line.length === 0) return;

    attack(line);
});

var attack = function (line) {
    try {
        var reqOptions = {
            host: xssOptions.host,
            port: xssOptions.port,
            protocol: xssOptions.protocol,
            method: xssOptions.method,
            path: stringFormat(xssOptions.path, escape(line)),
            headers: { 
                "User-Agent" : "xss-scanner"
            }
        };

        if (xssOptions.proxy) {
            reqOptions.host = xssOptions.proxy.host;
            reqOptions.port = xssOptions.proxy.port;
            reqOptions.headers["Host"] = xssOptions.host;
        }

        if (xssOptions.method === "POST") {
            reqOptions.headers["Content-Type"] = "application/x-www-form-urlencoded";
            reqOptions.headers["Content-Length"] = Buffer.byteLength(xssOptions.postData)
        }

        var request = http.request(reqOptions, (res) => {
            const statusCode = res.statusCode;

            var rawData = "";
            res.on("data", (chunk) => {
                rawData += chunk;
            });

            res.on("end", () => {
                if (statusCode != 200) return;
                if (rawData == null || rawData.length === 0) return;

                rawData = "<![CDATA[ " + line + "]]>" + rawData;

                console.log(chalk.red(line));

                if (xssOptions.fileOutput === false) return;

                fs.writeFile("output/" + uuid.v4() + ".html", rawData, (err) => {
                    if (err) {
                        console.log(chalk.red(err + " - output file"));
                    }
                });
            });
        });

        if (xssOptions.method === "POST") {
            request.write(xssOptions.postData);
        }

        request.end();
    } catch (err) { 
        console.log(chalk.red(err + " - " + line));
    }
};