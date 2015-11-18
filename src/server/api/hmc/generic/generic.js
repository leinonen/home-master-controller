'use strict';

var Group = require('./group.model.js');
var Promise = require('../../../util/promise');
var Transformer = require('./generic-transformer');

exports.transformGroup = Transformer.GenericGroup;
exports.transformGroups = Transformer.GenericGroups;

exports.group = (id) => Group.findById(id);

exports.groups = () => Group.findAll();

exports.create = (group) => {
  var g = new Group(group);
  g.save();
  return Promise.resolve(g);
};

exports.update = (id, group) => Group.findById(id)
  .then(g => {
    g.name = group.name;
    g.items = group.items;
    g.save();
    return g;
  });

exports.remove = (id) => Group.findById(id).then(g => {
  g.remove();
  return 'Group removed!';
});

exports.groupDevices = (id) => Group.findById(id).then(group => group.items);
