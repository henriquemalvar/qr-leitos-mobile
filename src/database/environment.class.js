export class Environment {
  constructor(workspace) {
    this.workspace = workspace;
    this.config = this.getConfig();
  }

  getConfig() {
    return require("../environment/firebase.json");
  }

  getEnvironmentConfig(configName, workspace = this.workspace) {
    return this.config[configName][workspace];
  }
}
