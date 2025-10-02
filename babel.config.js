module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Only include nativewind/babel if you're using NativeWind classes
      // 'nativewind/babel',
    ],
  };
};
