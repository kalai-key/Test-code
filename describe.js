var describeTest = (function () {
    var stack = [],
        ctx = {},
        activity = {
            setup: function (fn) { fn.call(ctx); },
            teardown: function (fn) { fn.call(ctx); },
            describe: function (args /* [title, testfn] */) {
                log(test_title(stack, args[0]));
                exec_describe(args[0], args[1]);
            },
            tests: function (args /* [title, testfn] */) {
                reportTests(args[1], args[0]);
            }
        };

    return {
        setup: spush.bind(null, 'setup'),
        teardown: spush.bind(null, 'teardown'),
        describe: describe,
        it: function (desc, fn) { spush('tests', [desc, fn]); }
    };

    function describe(title, testfn) {
        if (stack.length != 0) {
            return spush('describe', [title, testfn]);
        }
        exec_describe(title, testfn);
    }
    function spush(key, val){
        stack[stack.length-1][key].push(val);
    }

    function exec_describe(title, tfn) {
        stack.push(new_top(title));
        tfn.call(ctx); // collect describe, setup, teardown and it.
        exec_top();  // execute them
        stack.pop();
    }
    function new_top(title) {
        return {title: title, tests: [], setup: [], teardown: [], describe: []};
    }
    function exec_top() {
        'setup tests describe teardown'.split(' ').map(sexec);
    }
    function sexec(key) {
        var top = stack[stack.length-1];
        top[key].forEach(activity[key]);
    }

    function reportTests(fn, desc) {
        desc = test_title(stack, desc);
        try {
            fn.call(ctx);
            success(desc);
        } catch(e) {
            failure(desc, e.message);
        }
    }
    function test_title(stack, ctxt) {
        var indent = stack.map(function () { return '    '; });
        return indent.slice(1).concat([ctxt]).join(' ');
        // return pluck(stack, 'title').concat([ctxt]).join(' ');
    }
}());

module.exports = describeTest;

function success(desc) {
    console.log(desc + ' : Pass');
}
function failure(desc, msg) {
    console.log(':('+desc + ' : Fail => ' + msg);
}
function log(desc) {
    console.log(desc);
}

function pluck(arr, key) {
    return arr.map(function (v) {return v[key];});
}
