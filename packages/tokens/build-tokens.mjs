import StyleDictionary from 'style-dictionary';

// Light mode: all tokens → :root { ... }
const sdLight = new StyleDictionary({
  usesDtcg: true,
  source: ['colors.json', 'spacing.json', 'typography.json', 'elevation.json'],
  platforms: {
    css: {
      transformGroup: 'css',
      buildPath: 'build/css/',
      files: [
        {
          destination: 'variables.css',
          format: 'css/variables',
          options: {
            outputReferences: true,
          },
        },
      ],
    },
    js: {
      transformGroup: 'js',
      buildPath: 'build/js/',
      files: [
        {
          destination: 'tokens.js',
          format: 'javascript/es6',
        },
        {
          destination: 'tokens.d.ts',
          format: 'typescript/es6-declarations',
        },
      ],
    },
  },
});

await sdLight.buildAllPlatforms();

// Dark mode: semantic overrides only → appended to variables.css as [data-theme="dark"] { ... }
const sdDark = new StyleDictionary({
  usesDtcg: true,
  include: ['colors.json', 'spacing.json', 'typography.json', 'elevation.json'],
  source: ['colors-dark.json'],
  platforms: {
    css: {
      transformGroup: 'css',
      buildPath: 'build/css/',
      files: [
        {
          destination: 'variables-dark.css',
          format: 'css/variables',
          filter: (token) => token.isSource,
          options: {
            outputReferences: false,
            selector: '[data-theme="dark"]',
          },
        },
      ],
    },
  },
});

await sdDark.buildAllPlatforms();

// Append dark mode block into variables.css
import { readFileSync, writeFileSync } from 'fs';
const light = readFileSync('build/css/variables.css', 'utf8');
const dark = readFileSync('build/css/variables-dark.css', 'utf8');
writeFileSync('build/css/variables.css', light.trimEnd() + '\n\n' + dark);
