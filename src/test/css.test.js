/**
 * CSS unit test (8.14)
 * Validates that index.css has exactly one body rule with correct properties
 * and no Vite boilerplate.
 */
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const cssPath = resolve(__dirname, '../index.css');
const cssContent = readFileSync(cssPath, 'utf-8');

describe('index.css — unit tests', () => {
  // ---------------------------------------------------------------------------
  // 8.14: index.css has exactly one body rule with correct properties
  //       and no Vite boilerplate
  // ---------------------------------------------------------------------------
  it('8.14 has exactly one body rule with correct properties and no Vite boilerplate', () => {
    // Count body rules — match "body {" or "body{" at the start of a rule
    const bodyRuleMatches = cssContent.match(/\bbody\s*\{/g);
    expect(bodyRuleMatches).not.toBeNull();
    expect(bodyRuleMatches.length).toBe(1);

    // Extract the body rule block
    const bodyRuleStart = cssContent.indexOf('body');
    const bodyBlockStart = cssContent.indexOf('{', bodyRuleStart);
    const bodyBlockEnd = cssContent.indexOf('}', bodyBlockStart);
    const bodyBlock = cssContent.slice(bodyBlockStart + 1, bodyBlockEnd);

    // Should have margin: 0
    expect(bodyBlock).toMatch(/margin\s*:\s*0/);

    // Should have background-color: #111
    expect(bodyBlock).toMatch(/background-color\s*:\s*#111/);

    // Should have color: #fff
    expect(bodyBlock).toMatch(/color\s*:\s*#fff/);

    // Should have font-family with Arial
    expect(bodyBlock).toMatch(/font-family\s*:/);
    expect(bodyBlock).toContain('Arial');

    // Should have min-height: 100vh
    expect(bodyBlock).toMatch(/min-height\s*:\s*100vh/);

    // Should NOT have display: flex (Vite boilerplate)
    expect(bodyBlock).not.toMatch(/display\s*:\s*flex/);

    // Should NOT have place-items (Vite boilerplate)
    expect(bodyBlock).not.toMatch(/place-items/);
  });

  it('does not contain Vite boilerplate colors (#646cff)', () => {
    expect(cssContent).not.toContain('#646cff');
  });

  it('does not contain light-mode media query (Vite boilerplate)', () => {
    // Vite boilerplate has prefers-color-scheme: light
    expect(cssContent).not.toMatch(/prefers-color-scheme\s*:\s*light/);
  });

  it('has a box-sizing rule for *, *::before, *::after', () => {
    expect(cssContent).toMatch(/\*\s*,\s*\*::before\s*,\s*\*::after/);
    expect(cssContent).toMatch(/box-sizing\s*:\s*border-box/);
  });
});
