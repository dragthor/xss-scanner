module.exports = {
	stringFormat
}

// Thanks ASP.NET AJAX 1.0 Source Code Released
// https://weblogs.asp.net/scottgu/asp-net-ajax-1-0-source-code-released
function stringFormat (s) {
    for (var i = 0; i < arguments.length - 1; i++) {
        var reg = new RegExp("\\{" + i + "\\}", "gm");
        s = s.replace(reg, arguments[i + 1]);
    }
    return s;
};