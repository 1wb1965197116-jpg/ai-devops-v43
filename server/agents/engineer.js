function build(task) {
  return {
    file: "system",
    action: "update logic",
    task: task.name
  };
}

module.exports = { build };
