export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',     // new feature
        'fix',      // bug fix
        'docs',     // documentation only
        'style',    // formatting, missing semicolons, etc
        'refactor', // neither fixes a bug nor adds a feature
        'perf',     // performance improvement
        'test',     // adding missing tests
        'build',    // changes to build system or dependencies
        'ci',       // changes to CI configuration
        'chore',    // other changes that don't modify src or test files
        'revert',   // reverts a previous commit
      ],
    ],
    'scope-case': [2, 'always', 'lower-case'],
    'subject-case': [2, 'never', ['start-case', 'pascal-case', 'upper-case']],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'header-max-length': [2, 'always', 100],
  },
};
