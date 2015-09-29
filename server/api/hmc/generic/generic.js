'use strict';

var Group = require('./group.model.js');
var Promise = require('../../../util/promise');
var Transformer = require('./generic-transformer');

exports.transformGroup = Transformer.GenericGroup;
exports.transformGroups = Transformer.GenericGroups;


var group = (id) => Group.findById(id);
exports.group = group;

/**
 * Get all generic groups.
 * @returns {*}
 */
var groups = () => Group.findAll();

exports.groups = groups;

/**
 * Create a generic group.
 * @param group
 * @returns {Group}
 */
var create = (group) => {
  var g = new Group(group);
  g.save();
  return Promise.resolve(g);
}

exports.create = create;


/**
 * Update a generic group.
 * @param id
 * @param group
 * @returns {*}
 */
var update = (id, group) => Group.findById(id)
  .then(g => {
    g.name = group.name;
    g.items = group.items;
    g.save();
    return g;
  });

exports.update = update;

/**
 * Delete a generic group.
 * @param id
 * @returns {*}
 */
var remove = (id) => Group.findById(id).then(g => {
  g.remove();
  return 'Group removed!';
});

exports.remove = remove;

/**
 * Get the devices in a group.
 * @param id
 * @returns {*}
 */
var groupDevices = (id) => Group.findById(id).then(group => group.items);

exports.groupDevices = groupDevices;
