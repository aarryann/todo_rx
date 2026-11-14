const config = {
  enabled: true
};

export default {
  schema: {
    board: {
      count: "number",
    
      name: "string"
    }
  },

  config,

  load() {
    return config;
  }
};