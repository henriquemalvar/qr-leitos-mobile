
export class Environment {
  workspace
  constructor(workspace) {
    // Load the environment configuration data from the file
    this.workspace = workspace;
    this.config = this.loadConfig();
  }
  
  loadConfig() {
    let config= require('../environment/firebase.json');
    // Parse the configuration data as JSON
    // const config = JSON.parse(configData);
    return config;
  }
  
  getConfig(configName, workspace = this.workspace) {
    const config = this.config[configName][workspace];
    return config;
  }
}
