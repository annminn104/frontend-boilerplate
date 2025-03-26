const eslintConfig = {
  $schema: 'https://json.schemastore.org/tsconfig',
  display: 'Default',
  compilerOptions: {
    declaration: true,
    declarationMap: true,
    esModuleInterop: true,
    incremental: false,
    isolatedModules: true,
    lib: ['es2022', 'DOM', 'DOM.Iterable'],
    module: 'ESNext',
    moduleDetection: 'force',
    moduleResolution: 'Bundler',
    noUncheckedIndexedAccess: true,
    resolveJsonModule: true,
    skipLibCheck: true,
    strict: true,
    target: 'ES2022',
    plugins: [{ name: 'next' }],
    allowJs: true,
    allowJs: true,
    jsx: 'preserve',
    noEmit: true,
  },
}
/** @type {import("eslint").Linter.Config} */
export default eslintConfig
