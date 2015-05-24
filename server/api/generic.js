var Group = require('../../models/group');
/**
 * Get all generic groups.
 * @returns {*}
 */
function groups() {
  return Group.findAll();
}
exports.groups = groups;

/**
 * Create a generic group.
 * @param group
 * @returns {Group}
 */
function create(group) {
  var deferred = Q.defer();
  var g = new Group(group);
  g.save();
  deferred.resolve(g);
  return deferred.promise;
}
exports.create = create;


/**
 * Update a generic group.
 * @param id
 * @param group
 * @returns {*}
 */
function update(id, group) {
  return Group.findById(id).then(function (g) {
    g.name = group.name;
    g.items = group.items;
    g.save();
    return g;
  });
}
exports.update = update;

/**
 * Delete a generic group.
 * @param id
 * @returns {*}
 */
function remove(id) {
  return Group.findById(id).then(function (g) {
    g.remove();
    return 'Group removed!';
  });
}
exports.remove = remove;

/**
 * Get the devices in a group.
 * @param id
 * @returns {*}
 */
function groupDevices(id) {
  return Group.findById(id).then(function (group) {
    return group.items;
  });
}
exports.groupDevices = groupDevices;
