'use strict';

function toCard(task) {
  return {
    id: task.id || task._id?.toString(),
    title: task.title,
    description: task.description,
    priority: task.priority,
    dueDate: task.dueDate,
    status: task.status,
    image: task.image ? task.image.url : null,
  };
}

function toDetails(task) {
  return {
    ...toCard(task),
    owner: task.owner?.toString ? task.owner.toString() : task.owner,
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
  };
}

module.exports = { toCard, toDetails };
