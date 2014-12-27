"use strict";

var devIp = require("../lib/dev-ip");
var respNone = require("./fixtures/resp-none");
var respSingle = require("./fixtures/resp-single");
var respMultiple = require("./fixtures/resp-multiple");
var respMany = require("./fixtures/resp-many");
var sinon = require("sinon");
var assert = require("chai").assert;
var os = require("os");

// From the resp files
var match1 = "10.104.103.181";
var match2 = "10.104.100.12";
var match3 = "192.168.2.1";
var match4 = "192.168.56.1";

var regex = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;

describe("Getting the IP with a single result", function () {
    var osStub;
    var result;
    before(function () {
        osStub = sinon.stub(os, "networkInterfaces").returns(respSingle);
    });
    beforeEach(function () {
        result = devIp.getIp(null);
    });
    after(function () {
        osStub.restore();
    });
    it("should return the IP when a single match found", function () {
        var expected = match1;
        assert.equal(result, expected);
    });
    it("should return a string matching the regex", function () {
        var actual = regex.exec(result);
        assert.isNotNull(actual);
    });
});

describe("Getting the IP with Multiple results", function () {
    var osStub;
    var result;
    before(function () {
        osStub = sinon.stub(os, "networkInterfaces").returns(respMultiple);
    });
    beforeEach(function () {
        result = devIp.getIp(null);
    });
    after(function () {
        osStub.restore();
    });
    it("should return an array of results", function () {
        assert.equal(result[0], match1);
        assert.equal(result[1], match2);
    });
    it("should return a string matching the regex", function () {
        var actual = regex.exec(result[0]);
        assert.isNotNull(actual);
        actual = regex.exec(result[1]);
        assert.isNotNull(actual);
    });
});

describe("Getting the IP with no results", function () {
    var osStub;
    var result;
    before(function () {
        osStub = sinon.stub(os, "networkInterfaces").returns(respNone);
    });
    after(function () {
        osStub.restore();
    });
    it("should return false", function () {
        var actual = devIp.getIp(null);
        assert.isFalse(actual);
    });
    it("should return an error message if used on command line", function () {
        var actual = devIp.getIp("cli");
        var expected = "Couldn't find a suitable IP for you to use. (You're probably offline!)";
        assert.equal(actual, expected);
    });
});

describe("Getting full info with a single result", function () {
    var osStub;
    var result;
    before(function () {
        osStub = sinon.stub(os, "networkInterfaces").returns(respSingle);
    });
    beforeEach(function () {
        result = devIp.getIp(null, {full: true});
    });
    after(function () {
        osStub.restore();
    });
    it("should return the full info object when a single match found", function () {
        var expected = {
                        name: "en0",
                        ip: "10.104.103.181",
                        address: {
                            address: "10.104.103.181",
                            family: "IPv4",
                            internal: false
                        }
                    };
        assert.deepEqual(result, expected);
    });
});

describe("Getting full info with Multiple results", function () {
    var osStub;
    var result;
    before(function () {
        osStub = sinon.stub(os, "networkInterfaces").returns(respMultiple);
    });
    beforeEach(function () {
        result = devIp.getIp(null, {full: true});
    });
    after(function () {
        osStub.restore();
    });
    it("should return an array of results", function () {
        var expected1 = {
                        name: "en0",
                        ip: "10.104.103.181",
                        address: {
                            address: "10.104.103.181",
                            family: "IPv4",
                            internal: false
                        }
                    };
        var expected2 = {
                        name: "en0",
                        ip: "10.104.100.12",
                        address: {
                            address: "10.104.100.12",
                            family: "IPv4",
                            internal: false
                        }
                    };

        assert.deepEqual(result[0], expected1);
        assert.deepEqual(result[1], expected2);
    });
});

describe("Getting full info with no results", function () {
    var osStub;
    var result;
    before(function () {
        osStub = sinon.stub(os, "networkInterfaces").returns(respNone);
    });
    after(function () {
        osStub.restore();
    });
    it("should return false", function () {
        var actual = devIp.getIp(null, {full: true});
        assert.isFalse(actual);
    });
    it("should return an error message if used on command line", function () {
        var actual = devIp.getIp("cli", {full: true});
        var expected = "Couldn't find a suitable IP for you to use. (You're probably offline!)";
        assert.equal(actual, expected);
    });
});

describe("Getting the IPs with many results", function () {
    var osStub;
    var result;
    before(function () {
        osStub = sinon.stub(os, "networkInterfaces").returns(respMany);
    });
    beforeEach(function () {
        result = devIp.getIp(null);
    });
    after(function () {
        osStub.restore();
    });
    it("should return only requested values", function () {
        assert.equal(result.length, 4);
        assert.equal(result[0], match1);
        assert.equal(result[1], match2);
        assert.equal(result[2], match3);
        assert.equal(result[3], match4);
    });
});

describe("Getting only IPs from requested interfaces with many results", function () {
    var osStub;
    var result;
    before(function () {
        osStub = sinon.stub(os, "networkInterfaces").returns(respMany);
    });
    beforeEach(function () {
        result = devIp.getIp(null, {dev: ["en0", "en1"]});
    });
    after(function () {
        osStub.restore();
    });
    it("should return only requested values", function () {
        assert.equal(result.length, 3);
        assert.equal(result[0], match1);
        assert.equal(result[1], match2);
        assert.equal(result[2], match3);
    });
});
