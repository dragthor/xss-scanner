module.exports = {
	stringFormat,
    ripPayload
}

const readline = require("readline");
const fs = require("fs");

// Thanks ASP.NET AJAX 1.0 Source Code Released
// https://weblogs.asp.net/scottgu/asp-net-ajax-1-0-source-code-released
function stringFormat (s) {
    for (var i = 0; i < arguments.length - 1; i++) {
        var reg = new RegExp("\\{" + i + "\\}", "gm");
        s = s.replace(reg, arguments[i + 1]);
    }
    return s;
};

function ripPayload(pathToPayload, attackCallback, doneCallback) {
    let payloadReader = readline.createInterface({
        input: fs.createReadStream(pathToPayload)
    });

    payloadReader.on("line", (line) => {
        if (line.length === 0) return;

        attackCallback(line);
    });

    payloadReader.on("close", () => {
        if (doneCallback) {
            doneCallback();
        }
    });
};