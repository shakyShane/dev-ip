'use strict';

var devIp = require("../lib/dev-ip");

/*global describe*/
/*global it*/
/*global expect*/
describe("Getting the IP", function () {

  it("should return a string matching the regex", function () {

    var regex = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;
    var actual = devIp.getIp();

    expect(regex.test(actual)).toBeTruthy();

  });
});
