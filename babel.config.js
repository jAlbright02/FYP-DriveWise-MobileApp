module.exports = {
    presets: ['babel-preset-expo'],
    plugins: [
      '@babel/plugin-transform-class-static-block',  // This enables static class blocks in your code
      [
        'module:react-native-dotenv',  // Add this to enable dotenv integration
        {
          moduleName: '@env',   // Default module name for importing env variables
          path: '.env',         // Path to your .env file (usually the root of your project)
        },
      ],
    ],
  };
  