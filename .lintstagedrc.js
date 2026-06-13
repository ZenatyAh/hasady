const lintStagedConfig = {
  '**/*.(md|json)': (filenames) => `prettier --write ${filenames.join(' ')}`,
  '**/*.(ts|tsx|js|jsx)': (filenames) => [
    `eslint --fix ${filenames.join(' ')}`,
    `prettier --write ${filenames.join(' ')}`,
  ],
};

module.exports = lintStagedConfig;
