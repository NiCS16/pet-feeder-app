module.exports = {
    plugins: [
      require('tailwindcss'),
      require('autoprefixer'),
      require('postcss-preset-env')({
        stage: 1, // Adjust the stage to your needs
      }),
    ],
  };
  