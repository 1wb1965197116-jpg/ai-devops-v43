let vault = {};

function setToken(name, value) {
  vault[name] = value;
}

function getToken(name) {
  return vault[name];
}

function clearVault() {
  vault = {};
}

module.exports = { setToken, getToken, clearVault };
