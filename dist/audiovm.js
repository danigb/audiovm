(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.AudioVM = {})));
}(this, (function (exports) { 'use strict';

function E() {
  // Keep this empty so it's easier to inherit from
  // (via https://github.com/lipsmack from https://github.com/scottcorgan/tiny-emitter/issues/3)
}

E.prototype = {
  on: function on(name, callback, ctx) {
    var e = this.e || (this.e = {});

    (e[name] || (e[name] = [])).push({
      fn: callback,
      ctx: ctx
    });

    return this;
  },

  once: function once(name, callback, ctx) {
    var self = this;
    function listener() {
      self.off(name, listener);
      callback.apply(ctx, arguments);
    }

    listener._ = callback;
    return this.on(name, listener, ctx);
  },

  emit: function emit(name) {
    var data = [].slice.call(arguments, 1);
    var evtArr = ((this.e || (this.e = {}))[name] || []).slice();
    var i = 0;
    var len = evtArr.length;

    for (i; i < len; i++) {
      evtArr[i].fn.apply(evtArr[i].ctx, data);
    }

    return this;
  },

  off: function off(name, callback) {
    var e = this.e || (this.e = {});
    var evts = e[name];
    var liveEvents = [];

    if (evts && callback) {
      for (var i = 0, len = evts.length; i < len; i++) {
        if (evts[i].fn !== callback && evts[i].fn._ !== callback) liveEvents.push(evts[i]);
      }
    }

    // Remove event from queue to prevent memory leak
    // Suggested by https://github.com/lazd
    // Ref: https://github.com/scottcorgan/tiny-emitter/commit/c6ebfaa9bc973b33d110a84a307742b7cf94c953#commitcomment-5024910

    liveEvents.length ? e[name] = liveEvents : delete e[name];

    return this;
  }
};

var tinyEmitter = E;

function commonjsRequire () {
	throw new Error('Dynamic requires are not currently supported by rollup-plugin-commonjs');
}



function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var FastPriorityQueue_1 = createCommonjsModule(function (module) {
    /**
     * FastPriorityQueue.js : a fast heap-based priority queue  in JavaScript.
     * (c) the authors
     * Licensed under the Apache License, Version 2.0.
     *
     * Speed-optimized heap-based priority queue for modern browsers and JavaScript engines.
     *
     * Usage :
             Installation (in shell, if you use node):
             $ npm install fastpriorityqueue
    
             Running test program (in JavaScript):
    
             // var FastPriorityQueue = require("fastpriorityqueue");// in node
             var x = new FastPriorityQueue();
             x.add(1);
             x.add(0);
             x.add(5);
             x.add(4);
             x.add(3);
             x.peek(); // should return 0, leaves x unchanged
             x.size; // should return 5, leaves x unchanged
             while(!x.isEmpty()) {
               console.log(x.poll());
             } // will print 0 1 3 4 5
             x.trim(); // (optional) optimizes memory usage
     */
    "use strict";

    var defaultcomparator = function defaultcomparator(a, b) {
        return a < b;
    };

    // the provided comparator function should take a, b and return *true* when a < b
    function FastPriorityQueue(comparator) {
        if (!(this instanceof FastPriorityQueue)) return new FastPriorityQueue(comparator);
        this.array = [];
        this.size = 0;
        this.compare = comparator || defaultcomparator;
    }

    // Add an element the the queue
    // runs in O(log n) time
    FastPriorityQueue.prototype.add = function (myval) {
        var i = this.size;
        this.array[this.size] = myval;
        this.size += 1;
        var p;
        var ap;
        while (i > 0) {
            p = i - 1 >> 1;
            ap = this.array[p];
            if (!this.compare(myval, ap)) {
                break;
            }
            this.array[i] = ap;
            i = p;
        }
        this.array[i] = myval;
    };

    // replace the content of the heap by provided array and "heapifies it"
    FastPriorityQueue.prototype.heapify = function (arr) {
        this.array = arr;
        this.size = arr.length;
        var i;
        for (i = this.size >> 1; i >= 0; i--) {
            this._percolateDown(i);
        }
    };

    // for internal use
    FastPriorityQueue.prototype._percolateUp = function (i) {
        var myval = this.array[i];
        var p;
        var ap;
        while (i > 0) {
            p = i - 1 >> 1;
            ap = this.array[p];
            if (!this.compare(myval, ap)) {
                break;
            }
            this.array[i] = ap;
            i = p;
        }
        this.array[i] = myval;
    };

    // for internal use
    FastPriorityQueue.prototype._percolateDown = function (i) {
        var size = this.size;
        var hsize = this.size >>> 1;
        var ai = this.array[i];
        var l;
        var r;
        var bestc;
        while (i < hsize) {
            l = (i << 1) + 1;
            r = l + 1;
            bestc = this.array[l];
            if (r < size) {
                if (this.compare(this.array[r], bestc)) {
                    l = r;
                    bestc = this.array[r];
                }
            }
            if (!this.compare(bestc, ai)) {
                break;
            }
            this.array[i] = bestc;
            i = l;
        }
        this.array[i] = ai;
    };

    // Look at the top of the queue (a smallest element)
    // executes in constant time
    //
    // Calling peek on an empty priority queue returns
    // the "undefined" value.
    // https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/undefined
    //
    FastPriorityQueue.prototype.peek = function () {
        if (this.size == 0) return undefined;
        return this.array[0];
    };

    // remove the element on top of the heap (a smallest element)
    // runs in logarithmic time
    //
    // If the priority queue is empty, the function returns the
    // "undefined" value.
    // https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/undefined
    //
    // For long-running and large priority queues, or priority queues
    // storing large objects, you may  want to call the trim function
    // at strategic times to recover allocated memory.
    FastPriorityQueue.prototype.poll = function () {
        if (this.size == 0) return undefined;
        var ans = this.array[0];
        if (this.size > 1) {
            this.array[0] = this.array[--this.size];
            this._percolateDown(0 | 0);
        } else {
            this.size -= 1;
        }
        return ans;
    };

    // This function adds the provided value to the heap, while removing
    //  and returning the peek value (like poll). The size of the priority
    // thus remains unchanged.
    FastPriorityQueue.prototype.replaceTop = function (myval) {
        if (this.size == 0) return undefined;
        var ans = this.array[0];
        this.array[0] = myval;
        this._percolateDown(0 | 0);
        return ans;
    };

    // recover unused memory (for long-running priority queues)
    FastPriorityQueue.prototype.trim = function () {
        this.array = this.array.slice(0, this.size);
    };

    // Check whether the heap is empty
    FastPriorityQueue.prototype.isEmpty = function () {
        return this.size === 0;
    };

    // just for illustration purposes
    var main = function main() {
        // main code
        var x = new FastPriorityQueue(function (a, b) {
            return a < b;
        });
        x.add(1);
        x.add(0);
        x.add(5);
        x.add(4);
        x.add(3);
        while (!x.isEmpty()) {
            console.log(x.poll());
        }
    };

    if (commonjsRequire.main === module) {
        main();
    }

    module.exports = FastPriorityQueue;
});

var nextId = 0;

/**
 * Creates a program with an instruction list
 * 
 * @param {array} instructions 
 * @param {function} onended 
 */
var init = function init(instructions, onended) {
  return {
    id: "#" + nextId++,
    instructions: instructions,
    count: 0,
    procs: [],
    onended: onended
  };
};

/**
 * Stop a program
 * 
 * @param {program} program 
 */
var stop = function stop(program) {
  console.log("stop program", program);
  program.procs.forEach(function (proc) {
    if (proc) proc.operations.length = 0;
  });
  program.onended(program);
};

/**
 * Add a process to a program
 * 
 * @param {process} proc 
 * @param {program} program 
 */
var addProcess = function addProcess(proc, program) {
  proc.pid = program.length;
  program.procs.push(proc);
  program.count++;
  return program;
};

/**
 * Detach a process from it's program
 * @param {process} proc 
 */
var removeProcess = function removeProcess(proc, program) {
  if (program.procs[proc.pid] === proc) {
    program.procs[proc.pid] = null;
    program.count--;
    if (program.count === 0) program.onended(program);
    proc.pid = null;
  }
  return proc;
};

var warn = function warn(name) {
  return function () {
    return console.warn(name + " is not in library");
  };
};

/**
 * Create a process from a parent
 */
var createProcess = function createProcess(parent) {
  return {
    parent: parent,
    context: parent.context,
    time: parent.time,
    speed: parent.speed,
    operations: [],
    stack: []
  };
};

/**
 * Create a process 
 * 
 * @param {array} instructions 
 * @param [process] parent 
 * @return {process}
 */
var fork = function fork(instructions, parent) {
  return load(instructions, createProcess(parent || { time: 0, speed: 1 }));
};

/**
 * Load instructions into a process
 * 
 * @param {Array} instructions
 * @param {process} proc 
 * @return {process}
 */
var load = function load(instructions, proc) {
  var i = instructions.length;
  while (i--) {
    proc.operations.push(instructions[i]);
  }return proc;
};

/**
 * Execute a process until given time
 * @param {process} proc 
 * @param {object} global 
 * @param {number} maxTime 
 */
var exec = function exec(time, proc, global) {
  var maxOps = 1000;
  var ops = proc.operations;
  while (proc.time < time && --maxOps && ops.length) {
    var op = ops.pop();
    if (typeof op === "function") {
      op(proc, global);
    } else if (typeof op === "string" && op[0] === "@") {
      (global.scope[op] || warn(op))(proc, global);
    } else {
      proc.stack.push(op);
    }
  }
  if (!maxOps) throw Error("[proc:" + proc.id + " - Loop limit reached");
  return ops.length;
};

var createVM = function createVM() {
  var scope = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var vm = new tinyEmitter();
  vm.queue = new FastPriorityQueue_1();
  vm.scope = scope;
  vm.time = 0;
  vm.speed = 1;

  // FIXME
  vm.run = function (i) {
    return spawn(i, vm);
  };
  return vm;
};

var schedule = function schedule(proc, vm) {
  return vm.queue.add(proc);
};

var run = function run(program, vm) {
  var proc = fork(program.instructions, vm);
  addProcess(proc, program);
  proc.program = program.id;
  schedule(proc, vm);
  return program;
};

var spawn = function spawn(instructions, vm, name) {
  var program = init(instructions, function () {
    vm.emit("ended", program);
    vm.emit("ended:" + program.id.slice(1), program);
    vm.scope[program.id] = null;
  });
  vm.scope[program.id] = program;
  return run(program, vm);
};

/**
 * Resume a vm machine for a period of time
 * 
 * @param {number} duration 
 * @param {vm} vm 
 */
var resume = function resume(duration, vm) {
  var endsAt = vm.time + duration * vm.speed;
  var proc = vm.queue.poll();
  while (proc && proc.time < endsAt) {
    if (exec(endsAt, proc, vm)) {
      schedule(proc, vm);
    } else {
      var program = vm.scope[proc.program];
      if (program) removeProcess(proc, program);
    }
    proc = vm.queue.poll();
  }
  if (proc) schedule(proc, vm);
  vm.time = endsAt;
  return vm.queue.size;
};

/**
 * Memory operations
 * @module memory
 */
var scope = {
  /**
   * __@defn__: define a function
   * @param [array] function body
   * @param [string] name of the function
   * 
   * @example
   * [[440, '@set-freq', '@pluck'], 'pluck-A4', '@defn']
   */
  "@defn": function defn(proc, env) {
    var name = "@" + proc.stack.pop();
    var program = proc.stack.pop();
    env.lib[name] = function (proc) {
      return proc.run(program);
    };
  },

  /**
   * Sets a value in the local context
   * @example
   * [440, 'freq', '@let']
   */
  "@let": function _let(proc) {
    var key = proc.stack.pop();
    var value = proc.stack.pop();
    if (!proc.context) proc.context = {};
    proc.context[key] = value;
  },

  /**
   * @get: get a value from context and push into the stack
   * @param [key] the key of the context value
   * 
   * @example
   * ['freq', '@get']
   */
  "@get": function get(proc) {
    var key = proc.stack.pop();
    var current = proc;
    while (current.context[key] === undefined && current.parent) {
      current = current.parent;
    }
    proc.stack.push(current.context[key]);
  },

  /**
   * Set a value into the context
   * @example
   * [440, 'freq', '@set']
   */
  "@set": function set(proc) {
    var key = proc.stack.pop();
    var value = proc.stack.pop();
    var current = proc;
    while (current.context[key] === undefined && current.parent) {
      current = current.parent;
    }
    current.context[key] = value;
  }
};

/**
 * Arithmetic and logic operations
 * @module alu
 */
var wrap = function wrap(a, b) {
  return (a % b + b) % b;
};

// A generic operation that pops one value from stack and pushes one result
var op1 = function op1(fn) {
  return function (proc) {
    proc.stack.push(fn(proc.stack.pop()));
  };
};

// A generic operation that pops two values from the stack and pushes one result
var op2 = function op2(fn) {
  return function (proc) {
    proc.stack.push(fn(proc.stack.pop(), proc.stack.pop()));
  };
};

var alu = {
  /**
   * Add two values
   * @example
   * [1, 2, "@add"]
   */
  "@add": op2(function (b, a) {
    return a + b;
  }),

  /**
   * Subtract two values
   * @example
   * [1, 0.5, "@sub"]
   */
  "@sub": op2(function (b, a) {
    return a - b;
  }),

  /**
   * Multiply two values
   * 
   * @example
   * [2, 3, "@mul"]
   */
  "@mul": op2(function (b, a) {
    return a * b;
  }),

  /**
   * Divide two values
   * [4, 2, "@div"]
   */
  "@div": op2(function (b, a) {
    return b === 0 ? 0 : a / b;
  }),

  /**
   * Modulo for positive and negative numbers (Euclidean)
   * @see http://en.wikipedia.org/wiki/Modulo_operation 
   * @example
   * [4, -2, "@wrap"]
   */
  "@wrap": op2(function (b, a) {
    return b === 0 ? 0 : wrap(a, b);
  }),

  /**
   * Standard module operation
   */
  "@mod": op2(function (b, a) {
    return b === 0 ? 0 : a % b;
  }),

  /**
   * Negative of a value
   */
  "@neg": op1(function (a) {
    return -a;
  }),

  /**
   * Conditional execution
   * @param array trueBranch
   * @param array falseBranch
   * @param boolean condition
   * 
   * @example
   * [['@kick'], ['@snare'], true, '@cond']
   */
  "@cond": function cond(proc) {
    var cond = proc.stack.pop();
    var falseProgr = proc.stack.pop();
    var trueProgr = proc.stack.pop();
    if (cond) load(trueProgr, proc);else load(falseProgr, proc);
  },

  /** 
   * Greater than
   */
  "@>": op2(function (b, a) {
    return a > b;
  }),

  /**
   *  Greater or equal than
   */
  "@>=": op2(function (b, a) {
    return a >= b;
  }),

  /**
   * Less than
   */
  "@<": op2(function (b, a) {
    return a < b;
  }),

  /**
   * Less or equal than
   */
  "@<=": op2(function (b, a) {
    return a <= b;
  }),

  /**
   * Is equal
   */
  "@==": op2(function (b, a) {
    return a === b;
  }),

  /**
   * Is not equal
   */
  "@!=": op2(function (b, a) {
    return a !== b;
  }),

  /**
   * Logic not
   */
  "@not": op1(function (a) {
    return !a;
  }),

  /**
   * Logic and
   */
  "@and": op2(function (b, a) {
    return a && b;
  }),

  /**
   * Logic or
   */
  "@or": op2(function (b, a) {
    return a || b;
  })
};

var process = {
  /**
   * Evaluate the program from the stack
   * @param {array} program
   * 
   * @example
   * [['minor', 'C3', 8, '@scale', '@let-Scale'], '@eval', '@get-Scale']
   */
  "@eval": function _eval(proc) {
    var program = proc.stack.pop();
    load(program, proc);
  },
  /**
   * Invoke a function
   * @param [string] name - the function name
   * 
   * @example
   * ['pluck', '@call']
   */
  "@call": function call(proc) {
    var name = proc.stack.pop();
    proc.run(["@" + name]);
  },

  /**
   * Get the next element from the stack and log it
   * @example
   * [60, '@mtof', '@log']
   */
  "@log": function log(proc) {
    var value = proc.stack.pop();
    console.log(proc.time, value);
  },

  /**
   * Duplicate the next value of the stack
   * @example
   * ['Hi', '@dup', '@log', '@log'] 
   */
  "@dup": function dup(proc) {
    var value = proc.stack[proc.stack.length - 1];
    proc.stack.push(value);
  },

  /**
   * Start a new child process
   */
  "@fork": function fork$$1(proc, env) {
    if (env.schedule) {
      var program = proc.stack.pop();
      env.schedule.fork(proc, program);
    }
  },

  /**
   * Fork (or replace) a loop with a name 
   * @param [array] program
   * @param [string] name
   * @example
   * [['@kick', '@wait-1'], 'kick', '@spawn']
   */
  "@spawn": function spawn(proc, env) {
    if (env.schedule) {
      var id = proc.stack.pop();
      env.schedule.remove(id);
      var program = proc.stack.pop();
      env.schedule.fork(proc, [id, "@id", program, "@forever"]);
    }
  },

  /**
   * Stop another process
   * @param [string] the id of the process
   */
  "@kill": function kill(proc, vm) {
    var id = proc.stack.pop();
    var program = vm.scope[id];
    stop(program);
  }
};

/**
 * Repetition
 * @module repetition
 */
var repetition = {
  "@loop": function loop(proc, vm) {
    var instructions = proc.stack.pop();
    spawn([instructions, "@forever"], vm);
  },
  /**
   * Repeat something a number of times
   * @param [array] the program to repeat
   * @param [number] the number of times
   */
  "@repeat": function repeat(proc) {
    var times = proc.stack.pop();
    var program = proc.stack.pop();
    if (times > 1) {
      load([program, times - 1, "@repeat"], proc);
    }
    load(program, proc);
  },

  /**
   * Repeat a program forever
   * @param [array] the program to repeat forever
   * @example
   * [[1, '@wait', '@pluck'], '@forever']
   */
  "@forever": function forever(proc) {
    var program = proc.stack.pop();
    load([program, "@forever"], proc);
    load(program, proc);
  },

  /**
   * @example
   * [':Pluck', [60, 61, 62], ['@mtof', '@set-freq', '@@note'], @each]   
   */
  "@each": function each(proc) {
    var fn = proc.stack.pop();
    var array = proc.stack[proc.stack.length - 1];
    if (array.length) {
      var next = array.shift();
      load([next, fn, "@eval", fn, "@each"], proc);
    }
  }
};

/**
 * Random operations
 * @module random
 */

var floor = Math.floor;
// generates a float between [0, 1)
var rnd = Math.random;
// a function that generates integer random in range [0,n)
var irnd = function irnd(n) {
  return floor(rnd() * n);
};

var random = {
  /**
   * Generate a random number between 0 and 1
   * @function
   * @example
   * ['@rand', '@kick:set-amp']
   */
  "@rand": function rand(proc) {
    proc.stack.push(rnd());
  },

  /**
   * Picks a random element from an array
   * @param {array} array
   * @function
   * @example
   * [['one', 'two', 'three'], '@pick', '@log']
   */
  "@pick": function pick(proc) {
    var arr = proc.stack[proc.stack.length - 1];
    proc.stack.push(arr[irnd(arr.length)]);
  }
};

/**
 * [![Build Status](https://travis-ci.org/danigb/microtonal.svg?branch=master)](https://travis-ci.org/danigb/microtonal)
 * 
 * > The enterprise of “musical set theory” aspires to catalogue all the chords available to contemporary composers. Unfortunately, this project turns out to be more complicated than one might imagine
 * 
 * Microtonal is a micro (3kb) library to create music compositions
 * 
 * [![npm install microtonal](https://nodei.co/npm/utonal.png?mini=true)](https://npmjs.org/package/utonal/)
 * 
 * @module microtonal
 */

///////////////
// UTILITIES //
///////////////

// convert a string into an array
var floor$1 = Math.floor;
var mod = function mod(a, b) {
  return (a % b + b) % b;
};

/////////////
// PITCHES //
/////////////

/**
 * Creates a pitch. A pitch is a float number representing the height of the note.
 * *The pitch is the same as the midi number* but with float precission.
 * 
 * Basicaly it tries to parse a float
 * @function
 * @param {number|string} source
 * @return {number} the pitch
 */
var pitch = function pitch(src) {
  var p = parseNote(src);
  return isNaN(p) ? parseFloat(src) : p;
};

var NOTES = "C Db D Eb E F Gb G Ab A Bb B".split(" ");
/**
 * Get the note name of a pitch
 * @param {number} pitch 
 * @return {string} the note name if any
 */


/**
 * Get the midi value of a pitch. The midi value is the pitch without the float
 * @function
 * @param {number} pitch
 * @return {integer} the midi number
 */


/**
 * Convert a pitch into a frequency
 * @function
 * @param {number} pitch
 * @param {number} [tuning = 440]
 * @return {number} the frequency
 */
var toFreq = function toFreq(p) {
  var t = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 440;
  return Math.pow(2, (p - 69) / 12) * t;
};

/**
 * Convert a frequency into a pitch
 * @function
 * @param {number} freq 
 * @param {number} [tuning = 440] 
 * @return {number} the pitch 
 */


/**
 * Transpose a pitch by an interval
 * @function
 * @param {number} pitch
 * @param {number} interval
 * @return {number} the resulting pitch
 * @example
 * tr(4, 3) => 7
 */


/**
 * Creates a function that transposes a pitch by an interval
 * @function
 * @param {number} interval
 * @return {function} the transpose function
 * @example
 * [60, 61, 82].map(trBy(3));
 */


/**
 * Finds the distance between two pitches
 * @function
 * @param {number} from
 * @param {number} to
 */


/**
 * Creates a function that finds a distance from a root
 * @function
 * @param {number} root
 * @return {function} the distance function
 */


/**
 * Invert a pitch along a center
 * @function
 * @param {number} pitch
 * @param {number} center
 * @return {number} the inverted pitch
 */


/**
 * Creates a function that inverts a note from a center
 * @function
 * @param {pitch} center
 * @return {function} the invert function
 */


/**
 * Find the center between two pitches
 * @function
 * @param {number} from
 * @param {number} to
 * @return {number} center
 */


/**
 * Get the pitch class of a pitch
 * @function
 * @param {number} pitch
 * @return {number} the pitch class number (0 = C, 1 = D, ... 6 = B with numbers in-between)
 */


/**
 * Transpose a pitch class 
 * @function
 * @param {number} pitchClass
 * @param {number} interval
 * @return {number} the pitch class of the transposition
 */




/**
 * Invert a pitch class from a center
 * @function
 * @param {number} pitchClass
 * @param {number} center
 * @return {number} the pitch class
 */


/////////////////////
// MUSICAL OBJECTS //
/////////////////////

/**
 * Create a musical object.
 * A musical object is as an ordered series of pitches, uncategorized and uninterpreted.
 * @function
 * @param {array<number>} pitches
 * @return {array<number>} the musical object
 * @example
 * mu('C D E') => [0, 2, 4]
 */


/**
 * Get the note names of a musical object.
 * @param {array<number>} list 
 * @return {array<string>} the musical object note names
 * @example
 * names([60, 61, 62]) => // ['C4', 'C#4', 'D4']
 */


/**
 * Sort a musical object
 * @function
 * @param {array<number>} mu
 * @param {boolean} [ascending = true]
 * @return {array<number>} the sorted musical object
 */


/**
 * Sort and remove duplicates from a musical object
 * @function
 * @param {array<number>} mu
 * @return {array<number>} a new musical object without the duplications
 */


/**
 * Create a pitch set: an unordered sets of pitches
 * @function
 * @param {array<number>} pitches
 * @return {array<number>} the pitch set
 * @see Geometry of Music, p. 40
 */


/**
 * Creates a pclist: an unordered collection of pitch class sets
 * @function
 * @param {array<number>} mu - the musical object
 * @return {array<number>} a new multiset object with the pitch classes
 */


/**
 * Creates a pitch class set: an ordered set of pitch classes
 * @function
 * @param {array<number>} mu - the musical object
 * @return {array<number>} a new pitch set array with the pitch classes
 */


////////////
// SCALES //
////////////

/**
 * Creates a scale generator. A scale generator is a function that returns an scale.
 * An scale is a function that, given a degree number, it returns the scale note.
 * 
 * @param {arr} intervals - the scale intervals during an octave
 * @return {function}
 * @example
 * const major = scaleGen([0, 2, 4, 5, 7, 9, 11]);
 * const Cmajor = major(60)
 * Cmajor(0) // => 60
 * Cmajor(1) // => 62
 */
var scaleGen = function scaleGen(ivls) {
  return function () {
    var tonic = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    return function (degree) {
      var d = mod(degree, ivls.length);
      var o = floor$1(degree / ivls.length);
      return tonic + ivls[d] + 12 * o;
    };
  };
};

/**
 * Creates a chromatic scale. 
 * @function
 * @param {number} tonic 
 * @return {function} the scale
 */
var chromatic = function chromatic() {
  var tonic = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  return function (degree) {
    return tonic + degree;
  };
};

/**
 * Creates a major scale
 * @function
 * @param {number} tonic 
 * @return {function} the scale
 */
var major = scaleGen([0, 2, 4, 5, 7, 9, 11]);

/**
 * Creates a minor scale
 * @function
 * @param {number} tonic 
 * @return {function} the scale
 */
var minor = scaleGen([0, 2, 3, 5, 7, 8, 10]);

/**
 * Creates a minor scale
 * @function
 * @param {number} tonic 
 * @return {function} the scale
 */


/**
 * A collection of named scales.
 * It includes: chromatic, major, minor
 */
var scales = { chromatic: chromatic, major: major, minor: minor };

/**
 * Generate a number of degrees of a given scale
 * @param {function} scale 
 * @param {number} elements
 * @example
 * const scale = degrees(major(60));
 * scale(8) // => [60, 62, 64, 65, 67, 69, 71, 72]
 * scale(-8) // =>
 */
function degrees(scale, num) {
  if (arguments.length === 1) return function (n) {
    return degrees(scale, n);
  };

  var dir = num < 0 ? -1 : 1;
  var max = dir * num;
  var r = [];
  for (var i = 0; i < max; i++) {
    r.push(scale(dir * i));
  }return r;
}

/////////////
// PARSING //
/////////////
var REGEX = /^([a-gA-G])(#{1,}|b{1,}|x{1,}|)(-?\d*)\s*$/;
var SEMI = [0, 2, 4, 5, 7, 9, 11];

/*
 * Get pitch of a note. In utonal, a pitch is a note midi number
 * By convention pitch classes are 0 to 11 (C to B)
 */
function parseNote(name) {
  var m = REGEX.exec(name);
  if (!m) return NaN;
  var step = (m[1].toUpperCase().charCodeAt(0) + 3) % 7;
  var acc = m[2].replace(/x/g, "##");
  var oct = +m[3] || -1;
  var dir = acc[0] === "b" ? -1 : 1;
  return SEMI[step] + dir * acc.length + oct * 12 + 12;
}

/**
 * Music operations
 * @module music
 */
var music = {
  /**
   * Convert midi to frequency
   * @param {number} midiNoteNumber
   * @return {number} frequency
   * 
   * @example
   * [60, '@mtof', '@pluck:note']
   */
  "@mtof": function mtof(proc) {
    var midi$$1 = pitch(proc.stack.pop());
    proc.stack.push(toFreq(midi$$1));
  },

  /**
   * Create a scale
   * @param {string} type
   * @param {string} tonic
   * @param {number} numberOfNotes
   * 
   * @example
   * ['major', 'C4', 8, '@scale']
   */
  "@scale": function scale(proc) {
    var num = proc.stack.pop();
    var tonic = pitch(proc.stack.pop());
    var type = proc.stack.pop();

    var notes = scales[type] ? degrees(scales[type](tonic), num) : [];
    proc.stack.push(notes);
  }
};

/**
 * Process operations
 * @module process
 */

var time = {
  /**
   * __@wait__: wait
   * @param [number] delay - the time to wait in beats
   * 
   * @example
   * [0.5, '@wait']
   */
  "@wait": function wait(proc) {
    var delay = proc.stack.pop();
    proc.time += delay;
  },

  /**
   * Wait until next beat
   * 
   * @example
   * ['@sync', '@kick']
   */
  "@sync": function sync(proc) {
    var delay = Math.floor(proc.time) + 1 - proc.time;
    if (delay < 0.99) proc.time = Math.floor(proc.time + 1);
  },

  "@pause": function pause(proc) {},
  "@resume": function resume(proc) {},

  /**
   * Stop current process
   */
  "@stop": function stop(proc) {}
};

var library = Object.assign({}, scope, alu, process, repetition, random, music, time);

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

var init$1 = function init(Gibberish) {
  if (!Gibberish && (typeof window === "undefined" ? "undefined" : _typeof(window)) !== undefined && window.Gibberish) {
    Gibberish = window.Gibberish;
  }
  if (!Gibberish.context) {
    Gibberish.init();
  }
  return Gibberish;
};

/**
 * Create a `run` function using the Gibberish library
 * 
 * @function
 * @name initGibberish
 * @param [Gibberish] Gibberish
 * @return {function} a function to run VM programs
 * 
 * @example
 * const run = AudioVM.initGibberish();
 * run([['@pluck', 1, '@wait'], '@loop']);
 * @example
 * // es6 modules
 * import { initGibberish } from 'audiovm'
 * const run = initGibberish();
 */
var gibberish = (function (vm, Gibberish) {
  Gibberish = init$1(Gibberish);
  var instruments = createRepository(Gibberish);
  updateScope(instruments, vm.scope);

  var bpm2bpa = 1 / Gibberish.context.sampleRate;
  Gibberish.sequencers.push({
    tick: function tick() {
      return resume(bpm2bpa, vm);
    }
  });

  return vm;
});

function updateScope(instruments, scope) {
  return instruments.names.reduce(function (lib, name) {
    lib["@" + name] = function () {
      var inst = instruments.get(name);
      inst.note();
    };
    lib["@" + name + ":note"] = function (proc) {
      var inst = instruments.get(name);
      var param = proc.stack.pop();
      inst[param] = proc.stack.pop();
      inst.note();
    };
    lib["@" + name + ":set"] = function (proc) {
      var inst = instruments.get(name);
      var key = proc.stack.pop();
      inst[key] = proc.stack.pop();
    };
    return lib;
  }, scope);
}

function createRepository(Gibberish) {
  var factories = createFactories(Gibberish);
  var names = Object.keys(factories);
  var cache = [];
  var get$$1 = function get$$1(name) {
    return cache[name] || (cache[name] = factories[name]());
  };
  return { get: get$$1, names: names, cache: cache };
}

function createFactories(Gibberish) {
  return {
    kick: function kick() {
      return new Gibberish.Kick({ decay: 0.2, freq: 80 }).connect();
    },
    snare: function snare() {
      return new Gibberish.Snare({ amp: 0.3, snappy: 1.5 }).connect();
    },
    hat: function hat() {
      return new Gibberish.Hat({ amp: 1.5 }).connect();
    },
    conga: function conga() {
      return new Gibberish.Conga({ amp: 0.25, freq: 400 }).connect();
    },
    tom: function tom() {
      return new Gibberish.Tom({ amp: 0.25, freq: 400 }).connect();
    },
    pluck: function pluck() {
      var pluck = new Gibberish.PolyKarplusStrong({
        freq: 400,
        maxVoices: 32,
        amp: 0.7
      }).connect();
      var _note = pluck.note.bind(pluck);
      var sampleRate = Gibberish.sampleRate;
      pluck.note = function () {
        var freq = pluck.freq;
        var amp = pluck.amp;
        pluck.damping = 1 - -6 / Math.log(freq / sampleRate);
        _note(freq, amp);
      };
      return pluck;
    },
    bass: function bass() {
      return new Gibberish.MonoSynth({
        attack: 44,
        decay: Gibberish.Time.beats(0.25),
        filterMult: 0.25,
        octave2: 0,
        octave3: 0
      }).connect();
    }
  };
}

var toStr = function toStr(o) {
  return o ? Array.isArray(o) ? "[" + o + "] " : o + " " : "";
};
var peek = function peek(arr) {
  var n = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  return arr[arr.length - 1 - n];
};

var withLog = function withLog(name, op) {
  return function (proc, env) {
    var time = proc.time.toFixed(2);
    var next = toStr(peek(proc.stack));
    var next2 = toStr(peek(proc.stack));
    console.log(time + " %c" + name, "background: #444; color: white;");
    console.log(next2 + next + "" + name);
    op(proc, env);
    console.log(toStr(peek(proc.stack)));
  };
};

/**
 * Add logging to the operations
 */
var logger = (function (vm) {
  var scope = vm.scope;
  var keys = Object.keys(scope);
  keys.forEach(function (key) {
    if (typeof key === "string" && key[0] === "@") {
      scope[key] = withLog(key, scope[key]);
    }
  });
  return vm;
});

var initGibberish = function initGibberish(scope) {
  return logger(gibberish(createVM(Object.assign({}, library, scope))));
};

exports.initGibberish = initGibberish;

Object.defineProperty(exports, '__esModule', { value: true });

})));
