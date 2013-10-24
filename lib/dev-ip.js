#! /usr/bin/env node
/*
 * dev-ip
 * https://github.com/shakyshane/dev-ip
 *
 * Copyright (c) 2013 Shane Osbourne
 * Licensed under the MIT license.
 */

'use strict';

var os = require('os');
var _ = require('lodash');

var messages = {
  success: "Try this: http://",
  error: "Couldn't find a suitable IP for you to use. (You're probably offline!)"
};

exports.getIp = function(env) {

  var networkInterfaces = os.networkInterfaces();

  var match;

  // loop through results and check that it's an IPv4 address & it's not internal
  _.each(networkInterfaces, function (_interface) {
      if (!match) {
        match = _.findWhere(_interface, function (address) {
          return address.internal === false && address.family === "IPv4";
        });
      }
  });

  if (match && match.address) {
    if (env === "cli") {
      return messages.success + match.address;
    }
    return match.address;
  }

  if (env === "cli") {
    return messages.error;
  }

  return false;
};

if (require.main === module) {
  console.log(exports.getIp("cli"));
}