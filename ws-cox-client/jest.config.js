module.exports = {
  preset: "ts-jest",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],

  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.ts", "**/?(*.)+(test).ts"],
};
