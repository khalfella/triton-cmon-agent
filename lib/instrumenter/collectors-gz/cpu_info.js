/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

/*
 * Copyright (c) 2018, Joyent, Inc.
 */

'use strict';
var mod_assert = require('assert-plus');
var kstat_common = require('../lib/kstat-common');

var CPU_INFO_READ_OPTS = {
    'class': 'misc',
    module: 'cpu_info',
    instance: kstat_common.GZ_ZONE_ID
};

/*
 * TODO: 'current_clock_Hz' vs 'clock_MHz' seems like it could be useful?
 */
var CPU_INFO_KSTATS = [
    {
        kstat_key: 'model',
        key: 'cpu_info_model',
        type: 'gauge',
        help: 'CPU model'
    }
];


function CpuinfoMetricCollector(opts) {
    var self = this;

    mod_assert.object(opts, 'opts');
    mod_assert.object(opts.kstatReader, 'opts.kstatReader');

    self.kstatReader = opts.kstatReader;
    self.kstatReadOpts = CPU_INFO_READ_OPTS;
}

CpuinfoMetricCollector.prototype.getMetrics =
function getMetrics(opts, callback) {
    var self = this;

    mod_assert.object(opts, 'opts');
    mod_assert.object(opts.zInfo, 'opts.zInfo');
    mod_assert.func(callback, 'callback');

    kstat_common.kstatsToMetrics({
        kstatMap: CPU_INFO_KSTATS,
        kstatReader: self.kstatReader,
        kstatReadOpts:
            kstat_common.kstatReadOpts(opts.zInfo, self.kstatReadOpts)
    }, callback);
};

CpuinfoMetricCollector.prototype.cacheTTL = function cacheTTL() {
    return (kstat_common.METRIC_TTL);
};

module.exports = CpuinfoMetricCollector;
