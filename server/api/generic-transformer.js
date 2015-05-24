var DeviceTypes = require('./device-types');

/**
 * Transform a generic group (as in mongo model) to custom format.
 * @param group
 * @returns {{}}
 */
function transformGenericGroup(group) {
  var item = {};
  item.name = group.name;
  item.id = group._id;
  item.items = [];
  item.items = group.items.map(function (a) {
    return a;
  });
  item.type = DeviceTypes.GENERIC_GROUP;
  item.state = {
    on: false
  };
  item.motorized = false;
  return item;
}
exports.GenericGroup = transformGenericGroup;

/**
 * Transform a list of generic groups to custom format.
 * @param groups
 * @returns {*}
 */
function transformGenericGroups(groups) {
  return groups.map(transformGenericGroup);
}

exports.GenericGroups = transformGenericGroups;

