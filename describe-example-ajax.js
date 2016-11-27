var assert = require('assert');
var tfns = require('./describe'),
    describe = tfns.describe,
    setup = tfns.setup,
    teardown = tfns.teardown,
    it = tfns.it;

function log() {
    console.log.apply(console, arguments);
}

var obj = {};
describe('True Or False? ', function(){
    describe('is', function() {
        describe('setup', function () {
            it('should setup num', function (done) {
                assert.equal(obj.num, 2);
                done();
            });
            setup(function () {
                obj.num = 2;
            });
            teardown(function () {
                obj.num = null;
            });
        });

        describe('teardown', function () {
            it('should teardown num', function (done) {
                assert.equal(obj.num, null);
                done();
            });
        });

        describe('truthy => ', function() {
            it('empty array', function(done) {
                assert.equal(!![0], true);
                done();
            });

            it('empty object', function(done) {
                assert.equal(!!{}, true);
                done();
            });

        });

        describe('falsy => ', function () {

            describe('undefined & nil', function () {
                it('undefined', function(done) {
                    assert.equal(!(void 0), true);
                    done();
                });
                it('null', function(done) {
                    assert.equal(!null, true);
                    done();
                });
            });

            it('empty array', function(done) {
                assert.equal(![], true);
                done();
            });
            it('NaN', function(done) {
                assert.equal(!NaN, true);
                done();
            });
            it('empty string', function(done) {
                assert.equal(!'', true);
                done();
            });
        });
    });
});
