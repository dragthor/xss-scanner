var { stringFormat } = require('../src/util')

const chai = require("chai");
const expect = chai.expect;

describe("stringFormat", () => {
    it("should handle single token", () => {
        let actual = stringFormat("/whatever.php?foo={0}", "bar");

        expect(actual).to.equal("/whatever.php?foo=bar");
    });

    it("should handle multiple tokens", () => {
        let actual = stringFormat("/whatever.php?foo={0}&fizz={1}", "bar", "buzz");

        expect(actual).to.equal("/whatever.php?foo=bar&fizz=buzz");
    });
});