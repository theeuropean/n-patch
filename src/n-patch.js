'use strict';

(function (root) {

  root.nPatch = nPatch;

  function nPatch(context) {

    context = context || nPatch.context;
    var nodeList = [];
    var currNode;
    var currExposition;

    function addNodeDef(type, name) {
      var node = {
        type: type,
        name: name
      };
      nodeList.push(node);
      currNode = node;
      currExposition = null;
    }

    function expose(param) {
      var exposition = {
        param: param
      };
      currNode.expose = currNode.expose || [];
      currNode.expose.push(exposition);
      currExposition = exposition;
      return this;
    }

    function as(name) {
      currExposition.as = name;
      return this;
    }

    function _default(value) {
      currExposition.default = value;
      return this;
    }

    function connect(destination) {
      currNode.connect = currNode.connect || [];
      currNode.connect.push(destination);
      return this;
    }

    function set(param, value) {
      currNode.set = currNode.set || [];
      currNode.set.push({
        param: param,
        value: value
      });
      return this;
    }

    function render() {

      var nodes = {};

      nodeList.forEach(addNode);
      var inputNode = getInputNode();
      var outputNode = getOutputNode();

      nodeList.forEach(connectNode);
      nodeList.forEach(exposeNodeParams);
      nodeList.forEach(setNodeParams);

      inputNode.connect = function (destination) {
        outputNode.connect(destination);
      };

      inputNode.nodes = nodes;

      return inputNode;

      // Private functions

      function nodeName(nodeDef) {
        return (nodeDefIsString(nodeDef) || nodeDef.name || nodeDef.type) + 'Node';
      }

      function findNode(nodeDef) {
        return nodes[nodeName(nodeDef)];
      }

      function nodeDefIsString(nodeDef) {
        if(typeof nodeDef === 'string') {
          return nodeDef;
        }
        return null;
      }

      function addNode(nodeDef) {
        var nodeType = nodeDefIsString(nodeDef) || nodeDef.type || nodeDef.name;
        var node = getNodeFromType(nodeType);
        nodes[nodeName(nodeDef)] = node;
      }

      function getNodeFromType(type) {
        switch(type) {
          case 'input':
          case 'output':
          case 'gain':
            return context.createGain();
          case 'delay':
            return context.createDelay();
          case 'osc':
            return context.createOscillator();
          default:
            throw new Error("Unrecognized node type");
        }
      }

      function connectNode(nodeDef, index) {
        var node = findNode(nodeDef);
        if(nodeDef.connect) {
          nodeDef.connect.forEach(function (destNodeName) {
            node.connect(nodes[destNodeName + 'Node']);
          });
        }
        if(index < (nodeList.length - 1)) {
          node.connect(findNode(nodeList[index + 1]));
        }
      }

      function exposeNodeParams(nodeDef) {
        var node = findNode(nodeDef);
        if(nodeDef.expose) {
          nodeDef.expose.forEach(function (exposeDef) {
            exposeNodeParam(node, exposeDef);
          });
        }    
      }

      function exposeNodeParam(node, exposeDef) {
        var paramName;
        var exposedName;
        if(isString(exposeDef)) {
          exposedName = paramName = exposeDef;
        }
        else {
          paramName = exposeDef.param;
          exposedName = exposeDef.as || paramName;
          if(exposeDef.default) {
            setNodeParam(node, paramName, exposeDef.default);
          }
        }
        inputNode[exposedName] = node[paramName];      
      }

      function setNodeParams(nodeDef) {
        var node = findNode(nodeDef);
        if(nodeDef.set) {
          nodeDef.set.forEach(function (setDef) {
            setNodeParam(node, setDef.param, setDef.value);
          });
        }
      }

      function setNodeParam(node, paramName, value) {
        node[paramName].value = value;
      }

      function isString(val) {
        return typeof val === 'string';
      }

      function getInputNode() {
        return findNode(nodeList[0]);
      }

      function getOutputNode() {
        return findNode(nodeList[nodeList.length - 1]);
      }

    }

    ['gain', 'input', 'output', 'delay', 'osc'].forEach(function (type) {
      render[type] = function (name) {
        addNodeDef(type, name);
        return this;
      };
    });

    render.expose = expose;
    render.as = as;
    render.default = _default;
    render.connect = connect;
    render.set = set;

    return render;

  }

})(this);