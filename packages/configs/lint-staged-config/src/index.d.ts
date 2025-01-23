declare module '@fe-boilerplate/lint-staged-config' {
  // Defines the structure for lint rules, where each key maps to a record of string to a function.
  export interface LintRule {
    [key: string]: Record<string, (filenames: string[]) => string | string[] | Promise<string | string[]>>
  }

  // Parameters for the getEslintFixCmd function.
  export interface Params {
    cwd: string
    files: string[]
    fix: boolean
    fixType?: ('problem' | 'suggestion' | 'layout' | 'directive')[]
    cache: boolean
    rules?: string[]
    maxWarnings?: number
  }

  // Function to generate the ESLint fix command based on provided parameters.
  export function getEslintFixCmd(params: Params): string

  // Function to concatenate file paths for Prettier.
  export function concatFilesForPrettier(filenames: string[]): string

  // Function to concatenate file paths for Stylelint.
  export function concatFilesForStylelint(filenames: string[]): string

  // Array of JSON-related lint rules.
  export const jsonRules: string[]

  // Lint rules for detecting secrets.
  export const secretsRules: LintRule

  // Lint rules for Markdown files.
  export const mdRules: LintRule

  // Array of YAML-related lint rules.
  export const yamlRules: string[]

  // Array of HTML-related lint rules.
  export const htmlRules: string[]
}
