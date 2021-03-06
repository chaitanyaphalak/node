'use strict';
const common = require('../common');
const assert = require('assert');
const path = require('path');
const fs = require('fs');

// test creating and reading symbolic link
const linkData = path.join(common.fixturesDir, 'cycles/');
const linkPath = path.join(common.tmpDir, 'cycles_link');

common.refreshTmpDir();

console.log('linkData: ' + linkData);
console.log('linkPath: ' + linkPath);

fs.symlink(linkData, linkPath, 'junction', common.mustCall(function(err) {
  assert.ifError(err);

  fs.lstat(linkPath, common.mustCall(function(err, stats) {
    assert.ifError(err);
    assert.ok(stats.isSymbolicLink());

    fs.readlink(linkPath, common.mustCall(function(err, destination) {
      assert.ifError(err);
      assert.strictEqual(destination, linkData);

      fs.unlink(linkPath, common.mustCall(function(err) {
        assert.ifError(err);
        assert(!common.fileExists(linkPath));
        assert(common.fileExists(linkData));
      }));
    }));
  }));
}));
