'use strict';

(function (root) {

  root.nPatch = nPatch;

  var nodeFactories = {};

  addNativeNodeFactory('gain', 'Gain');
  addNativeNodeFactory('delay', 'Delay');
  addNativeNodeFactory('biquad', 'BiquadFilter');
  addNativeNodeFactory('osc', 'Oscillator');

  // Public methods

  function nPatch() {

    var lastNode;
    var nodes = {};
    var lastParamName;

    var patcher = {
      patch: patch,
      connect: connect,
      param: param,
      expose: expose,
      set: set,
      nodes: nodes,
      start: start,
      stop: stop
    };

    appendNodeCreationMethods();

    return patcher;

    // Public methods

    function patch(nodeType, nodeName) {
      patcher.lastParamName = null;
      var newNode = createNode(nodeType);
      registerNode(newNode, nodeType, nodeName);
      if(!patcher.input) {
        // TODO only set input if node is a native node that takes input
        // or a patch container with an input property
        patcher.input = newNode;
      }
      if(lastNode && lastNode.connect) {
        lastNode.connect(newNode);
      }
      lastNode = newNode;
      return patcher;
    }

    function connect(destination) {
      // TODO handle named destination params e.g. 'gain.gain'
      if(typeof destination === 'string') {
        var destinationNode = nodes[destination];
        if(!destinationNode) {
          throw new Error('Unrecognized node name');
        }
        arguments[0] = destinationNode;
      }
      // TODO if destination node has an input property
      // connect to that
      lastNode.connect.apply(lastNode, arguments);
      return patcher;
    }

    function param(paramName) {
      verifyParam(paramName);
      lastParamName = paramName;
      return patcher;
    }

    function expose(exposedNameOrParamName, exposedName) {
      var paramName;

      if(lastParamName && !exposedName) {
        exposedName = exposedNameOrParamName || lastParamName;
        paramName = lastParamName;
      }
      else {
        paramName = exposedNameOrParamName;
        exposedName = exposedName || exposedNameOrParamName;
      }

      verifyParam(paramName);
      verifyAvailable(exposedName);
      patcher[exposedName] = lastNode[paramName];
      return patcher;
    }

    function set(paramNameOrValue, value) {
      var paramName = isSomething(value) ? paramNameOrValue : lastParamName;
      verifyParam(paramName);
      value = isSomething(value) ? value : paramNameOrValue;

      if(isDefined(lastNode[paramName].value)) {
        lastNode[paramName].value = value;        
      }
      else {
        lastNode[paramName] = value;
      }
      return patcher;
    }

    function start() {
      forEachNode(function (node) {
        if(isDefined(node.start)) node.start();
      });
    }
    
    function stop() {
      forEachNode(function (node) {
        if(isDefined(node.stop)) node.stop();
      });
    }
    
    // Private methods

    function appendNodeCreationMethods() {
      Object.keys(nodeFactories).forEach(function (name) {
        patcher[name] = function () {
          var args = Array.prototype.slice.call(arguments);
          args.unshift(name);
          return patcher.patch.apply(patcher, args);
        };
      });
    }

    function createNode(nodeType) {
      var factory = nodeFactories[nodeType];
      if(factory) return factory(nPatch.context);
      throw new Error('Unrecognized node type');
    }

    function registerNode(newNode, nodeType, nodeName) {
      if(nodeName) {
        if(nodes[nodeName]) {
          throw new Error('Cannot add named node to patch because patch already contains a node with the same name');
        }
      }
      else {
        nodeName = nodeType;
        var i = 0;
        while(nodes[nodeName]) {
          i++;
          nodeName = nodeType + i;
        }
      }
      nodes[nodeName] = newNode;    
    }

    function verifyParam(paramName) {
      if(isUndefined(lastNode[paramName])) {
        throw new Error('Cannot set or expose param "' + paramName + '" because attribute is not present on current node');
      }
    }

    function verifyAvailable(exposedParamName) {
      if(isDefined(patcher[exposedParamName])) {
        throw new Error('Cannot expose param with name "' + exposedParamName + '" because patcher already has attribute with the same name');
      }
    }

    function forEachNode(callback) {
      for(var nodeName in nodes) {
        if(nodes.hasOwnProperty(nodeName)) {
          var node = nodes[nodeName];
          callback(node);
        }
      }
    }

  }

  // Private methods

  function addNativeNodeFactory(name, nativeNodeType) {
    addNodeFactory(name, function (context) {
      return context['create' + nativeNodeType]();
    });
  }

  function addNodeFactory(name, factory) {
    if(nodeFactories[name]) {
      throw new Error('Cannot add node factory because one with the same name already exists');
    }
    nodeFactories[name] = factory;
    return this;
  }

  function isSomething(thing) {
    return !isNothing(thing);
  }

  function isNothing(thing) {
    return thing === null || isUndefined(thing);
  }

  function isDefined(thing) {
    return !isUndefined(thing);
  }

  function isUndefined(thing) {
    return typeof thing === 'undefined';
  }

})(this);