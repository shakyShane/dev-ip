#! /usr/bin/env node
/*
 * dev-ip
 * https://github.com/shakyshane/dev-ip
 *
 * Copyright (c) 2013 Shane Osbourne
 * Licensed under the MIT license.
 */

"use strict";

var os = require("os");
var _ = require("lodash");

var messages = {
    error: "Couldn't find a suitable IP for you to use. (You're probably offline!)"
};

exports.getIp = function (env, opts) {

    if (opts == null) {
        opts = {};
    }

    var networkInterfaces = os.networkInterfaces();

    var matches = [];
    var returnValue;

    // loop through results and check that it's an IPv4 address & it's not internal
    _.each(networkInterfaces, function (_interface, _name) {
        _.each(_interface, function (address) {
            var iface_match = (opts.dev == null) || (opts.dev === _name) || _.contains(opts.dev, _name);
            if (address.internal === false && address.family === "IPv4" && iface_match) {
                if (opts.full) {
                    var info = {
                        name: _name,
                        ip: address.address,
                        address: address
                    };
                    matches.push(info);
                } else {
                    matches.push(address.address);
                }
            }
        });
    });

    if (matches.length) {

        if (matches.length === 1) {
            returnValue = matches[0];
        } else {
            returnValue = matches;
        }

        return returnValue;
    }

    if (env === "cli") {
        return messages.error;
    }

    return false;
};

if (require.main === module) {
    console.log(exports.getIp("cli"));
}