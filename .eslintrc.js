module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ["@vue/prettier"],
  rules: {
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
    "require-atomic-updates": "off",
  },
  parserOptions: {
    parser: "babel-eslint"
  }
};
