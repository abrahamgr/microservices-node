module.exports = {
    env: {
      browser: true,
      es6: true,
    },
    extends: 'airbnb-base',
    globals: {
      Atomics: 'readonly',
      SharedArrayBuffer: 'readonly',
    },
    parserOptions: {
      ecmaVersion: 2018,
      sourceType: 'module',
    },
    rules: {
        "linebreak-style": 0,
        // indent: ['error', 2, { SwitchCase: 1 }],
        // "indent": ["error", "tab"],
        "indent": "off",
        quotes: ["off", "double"],
        semi: "off",
        "no-unused-vars": "off",
        "max-len": "off",
        "keyword-spacing": "off",
        "no-tabs": "off"
    },    
  };
  