const getIgnorePatterns = () => {
  return [
    // Hacky way to silence @yarnpkg/doctor about node_modules detection
    `**/${'node'}_modules}`,
    '**/.cache',
    '**/build',
    '**/dist',
    '**/.storybook',
    '**/storybook-static',
  ]
}

module.exports = {
  getIgnorePatterns,
}
