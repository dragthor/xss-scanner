var { stringFormat, ripPayload } = require('./util');
var { xssOptions } = require('./config');

const http = require("http");
const fs = require("fs");
const uuid = require("node-uuid");
const chalk = require("chalk");

const config = xssOptions();

var attack = function (line) {
    try {
        var reqOptions = {
            host: config.host,
            port: config.port,
            protocol: config.protocol,
            method: config.method,
            path: stringFormat(config.path, escape(line)),
            headers: {
                "User-Agent": "xss-scanner"
            }
        };

        if (config.proxy) {
            reqOptions.host = config.proxy.host;
            reqOptions.port = config.proxy.port;
            reqOptions.headers["Host"] = config.host;
        }

        if (config.method === "POST") {
            reqOptions.headers["Content-Type"] = "application/x-www-form-urlencoded";
            reqOptions.headers["Content-Length"] = Buffer.byteLength(stringFormat(config.postData, line));
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

                rawData = "<!-- <![CDATA[ " + line + "]]> -->" + rawData;

                console.log(chalk.red(line));

                if (config.fileOutput === false) return;

                fs.writeFile("output/" + uuid.v4() + ".html", rawData, (err) => {
                    if (err) {
                        console.log(chalk.red(err + " - output file"));
                    }
                });
            });
        });

        if (config.method === "POST") {
            request.write(stringFormat(config.postData, line));
        }

        request.end();
    } catch (err) {
        console.log(chalk.red(err + " - " + line));
    }
};

ripPayload(config.payloadFile, attack);