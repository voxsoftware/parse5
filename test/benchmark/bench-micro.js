'use strict';

var path = require('path'),
    fs = require('fs'),
    upstreamParse5 = require('parse5'),
    testUtils = require('../test_utils');

//HACK: https://github.com/bestiejs/benchmark.js/issues/51
global.upstreamParser = new upstreamParse5.Parser();
global.workingCopy = require('../../lib');
global.micro = testUtils
    .loadTreeConstructionTestData([path.join(__dirname, '../data/tree_construction')], workingCopy.treeAdapters.default)
    .map(function (test) {
        return {
            html: test.input,
            fragmentContext: test.fragmentContext
        }
    });

global.runMicro = function (parser) {
    for (var i = 0; i < micro.length; i++) {
        if (micro[i].fragmentContext)
            parser.parseFragment(micro[i].html, micro[i].fragmentContext);
        else
            parser.parse(micro[i].html);

    }
};

module.exports = {
    name: 'parse5 regression benchmark - MICRO',
    tests: [
        {
            name: 'Working copy',

            fn: function () {
                runMicro(workingCopy);
            }
        },
        {
            name: 'Upstream',

            fn: function () {
                runMicro(upstreamParser);
            }
        }
    ]
};

