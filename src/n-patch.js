'use strict';

(function (root) {

  var nodeFactories = {};

  addNativeNodeType('gain', 'Gain');
  addNativeNodeType('delay', 'Delay');
  // addNativeNodeType('input', 'Gain');
  // addNativeNodeType('output', 'Gain');
  // addNativeNodeType('osc', 'Oscillator');
  // addNativeNodeType('biquad', 'BiquadFilter');

  function addNativeNodeType(name, nativeNodeType) {
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

  function createPatchContainer(nodeType, options) {

    var lastNode;
    var input;
    var nodes = {};

    patch(nodeType, options);

    // Public methods

    function patch(nodeType, nodeName) {
      var newNode = createNode(nodeType);
      registerNode(newNode, nodeType, nodeName);
      if(!input) {
        // TODO only set input if node is a waaNode that takes input
        // or a patch container with an input property
        input = newNode;
      }
      if(lastNode && lastNode.connect) {
        lastNode.connect(newNode);
      }
      lastNode = newNode;
      return this;
    }

    function connect(destination) {
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
      return this;
    }
    
    // Private methods

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

    // Reveal

    return {
      patch: patch,
      gain: function () {
        var args = Array.prototype.slice.call(arguments);
        args.unshift('gain');
        return patch.apply(this, args);
      },
      delay: function () {
        var args = Array.prototype.slice.call(arguments);
        args.unshift('delay');
        return patch.apply(this, args);
      },
      input: input,
      connect: connect,
      nodes: nodes
    };

  }

  // function nPatch() {

  //   var nodeList = [];
  //   var currNode;
  //   var currExposition;

  //   function addNodeDef(type, name) {
  //     var node = {
  //       type: type,
  //       name: name
  //     };
  //     nodeList.push(node);
  //     currNode = node;
  //     currExposition = null;
  //   }

  //   function expose(param) {
  //     var exposition = {
  //       param: param
  //     };
  //     currNode.expose = currNode.expose || [];
  //     currNode.expose.push(exposition);
  //     currExposition = exposition;
  //     return this;
  //   }

  //   function as(name) {
  //     currExposition.as = name;
  //     return this;
  //   }

  //   function _default(value) {
  //     currExposition.default = value;
  //     return this;
  //   }

  //   function connect(destination) {
  //     currNode.connect = currNode.connect || [];
  //     currNode.connect.push(destination);
  //     return this;
  //   }

  //   function set(param, value) {
  //     currNode.set = currNode.set || [];
  //     currNode.set.push({
  //       param: param,
  //       value: value
  //     });
  //     return this;
  //   }

  //   function render(context) {

  //     context = context || nPatch.context;
  //     var nodes = {};

  //     nodeList.forEach(addNode);
  //     var inputNode = getInputNode();
  //     var outputNode = getOutputNode();

  //     nodeList.forEach(connectNode);
  //     nodeList.forEach(exposeNodeParams);
  //     nodeList.forEach(setNodeParams);

  //     inputNode.connect = function (destination) {
  //       outputNode.connect(destination);
  //     };

  //     inputNode.nodes = nodes;

  //     return inputNode;

  //     // Private functions

  //     function nodeName(nodeDef) {
  //       return (nodeDefIsString(nodeDef) || nodeDef.name || nodeDef.type) + 'Node';
  //     }

  //     function findNode(nodeDef) {
  //       return nodes[nodeName(nodeDef)];
  //     }

  //     function nodeDefIsString(nodeDef) {
  //       if(typeof nodeDef === 'string') {
  //         return nodeDef;
  //       }
  //       return null;
  //     }

  //     function addNode(nodeDef) {
  //       var nodeType = nodeDefIsString(nodeDef) || nodeDef.type || nodeDef.name;
  //       var node = getNodeFromType(nodeType);
  //       nodes[nodeName(nodeDef)] = node;
  //     }

  //     function getNodeFromType(type) {
  //       var factory = nodeFactories[type];
  //       if(factory) return factory(context);
  //       throw new Error("Unrecognized node type");
  //     }

  //     function connectNode(nodeDef, index) {
  //       var node = findNode(nodeDef);
  //       if(nodeDef.connect) {
  //         nodeDef.connect.forEach(function (destNodeName) {
  //           node.connect(nodes[destNodeName + 'Node']);
  //         });
  //       }
  //       if(index < (nodeList.length - 1)) {
  //         node.connect(findNode(nodeList[index + 1]));
  //       }
  //     }

  //     function exposeNodeParams(nodeDef) {
  //       var node = findNode(nodeDef);
  //       if(nodeDef.expose) {
  //         nodeDef.expose.forEach(function (exposeDef) {
  //           exposeNodeParam(node, exposeDef);
  //         });
  //       }    
  //     }

  //     function exposeNodeParam(node, exposeDef) {
  //       var paramName;
  //       var exposedName;
  //       if(isString(exposeDef)) {
  //         exposedName = paramName = exposeDef;
  //       }
  //       else {
  //         paramName = exposeDef.param;
  //         exposedName = exposeDef.as || paramName;
  //         if(exposeDef.default) {
  //           setNodeParam(node, paramName, exposeDef.default);
  //         }
  //       }
  //       inputNode[exposedName] = node[paramName];      
  //     }

  //     function setNodeParams(nodeDef) {
  //       var node = findNode(nodeDef);
  //       if(nodeDef.set) {
  //         nodeDef.set.forEach(function (setDef) {
  //           setNodeParam(node, setDef.param, setDef.value);
  //         });
  //       }
  //     }

  //     function setNodeParam(node, paramName, value) {
  //       node[paramName].value = value;
  //     }

  //     function isString(val) {
  //       return typeof val === 'string';
  //     }

  //     function getInputNode() {
  //       return findNode(nodeList[0]);
  //     }

  //     function getOutputNode() {
  //       return findNode(nodeList[nodeList.length - 1]);
  //     }

  //   }

  //   function addNodeTypeToRender(type) {
  //     render[type] = function (name) {
  //       addNodeDef(type, name);
  //       return this;
  //     };
  //   }

  //   Object.keys(nodeFactories).forEach(addNodeTypeToRender);

  //   render.expose = expose;
  //   render.as = as;
  //   render.default = _default;
  //   render.connect = connect;
  //   render.set = set;

  //   return render;

  // }

  root.nPatch = {
    patch: createPatchContainer,
    gain: function () {
      var args = Array.prototype.slice.call(arguments);
      args.unshift('gain');
      return createPatchContainer.apply(this, args);
    },
    delay: function () {
      var args = Array.prototype.slice.call(arguments);
      args.unshift('delay');
      return createPatchContainer.apply(this, args);
    },
    nodeFactories: nodeFactories
  };

})(this);