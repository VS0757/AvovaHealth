module.exports = {
  content: [
    // using ./src/ dir
    "./src/**/*.{js,ts,jsx,tsx}",
    // using ./ dir
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./_components/**/*.{js,ts,jsx,tsx}",
    "./_lib/**/*.{js,ts,jsx,tsx}",
    // add more paths here
  ],
  theme: {
    extend: {
      colors: {
        mint: "#057833",
        avova: "#E05767",
      },
    },
  },
  plugins: [],
  darkMode: "class",
};
