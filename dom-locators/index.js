/**
 * DOM to Playwright Locators Generator
 * Converts DOM HTML to efficient Playwright locators for all interactive elements
 */

const jsdom = require('jsdom');
const { JSDOM } = jsdom;

class DOMToPlaywrightLocators {
  constructor(domHtml) {
    const dom = new JSDOM(domHtml);
    this.document = dom.window.document;
    this.elements = [];
  }

  /**
   * Generate unique selectors for elements
   */
  generateSelector(element) {
    // Priority 1: ID attribute (most unique)
    if (element.id) {
      return `#${this.escapeCssSelector(element.id)}`;
    }

    // Priority 2: name attribute (for forms)
    if (element.name) {
      return `[name="${this.escapeCssSelector(element.name)}"]`;
    }

    // Priority 3: aria-label
    if (element.getAttribute('aria-label')) {
      return `[aria-label="${element.getAttribute('aria-label')}"]`;
    }

    // Priority 4: data-testid (common in modern apps)
    if (element.getAttribute('data-testid')) {
      return `[data-testid="${element.getAttribute('data-testid')}"]`;
    }

    // Priority 5: text content
    const text = element.innerText?.trim();
    if (text && text.length < 50) {
      return `text="${this.escapeText(text)}"`;
    }

    // Priority 6: Class combinations
    if (element.className) {
      const classes = element.className.split(' ').filter(c => c);
      if (classes.length > 0) {
        return `.${classes.join('.')}`;
      }
    }

    // Fallback: CSS path
    return this.getCssPath(element);
  }

  /**
   * Generate Playwright locator from selector
   */
  generatePlaywrightLocator(element) {
    const selector = this.generateSelector(element);

    // Use text locator for readable text
    const text = element.innerText?.trim();
    if (text && text.length < 100 && text.length > 0 && !text.includes('\n')) {
      return `locator('text="${this.escapeText(text)}"')`;
    }

    // Use role-based locator (most accessible)
    const roleLocator = this.generateRoleLocator(element);
    if (roleLocator) {
      return roleLocator;
    }

    // Use CSS selector
    if (selector.startsWith('#') || selector.startsWith('[')) {
      return `locator('${selector}')`;
    }

    return `locator('${selector}')`;
  }

  /**
   * Generate accessible role-based locators
   */
  generateRoleLocator(element) {
    const tag = element.tagName.toLowerCase();
    const text = element.innerText?.trim();

    switch (tag) {
      case 'button':
        if (text) {
          return `getByRole('button', { name: '${this.escapeText(text)}' })`;
        }
        return null;

      case 'input':
        const inputType = element.type || 'text';
        const placeholder = element.placeholder;
        const label = element.getAttribute('aria-label');

        if (label) {
          return `getByLabel('${this.escapeText(label)}')`;
        }
        if (placeholder) {
          return `getByPlaceholder('${this.escapeText(placeholder)}')`;
        }
        if (inputType === 'checkbox') {
          return `getByRole('checkbox', { name: '${this.escapeText(text)}' })`;
        }
        if (inputType === 'radio') {
          return `getByRole('radio', { name: '${this.escapeText(text)}' })`;
        }
        return null;

      case 'select':
        if (text) {
          return `getByRole('combobox', { name: '${this.escapeText(text)}' })`;
        }
        return null;

      case 'a':
        if (text) {
          return `getByRole('link', { name: '${this.escapeText(text)}' })`;
        }
        return null;

      case 'textarea':
        const textareaLabel = element.getAttribute('aria-label');
        if (textareaLabel) {
          return `getByLabel('${this.escapeText(textareaLabel)}')`;
        }
        return null;

      default:
        return null;
    }
  }

  /**
   * Get CSS path for element (fallback)
   */
  getCssPath(element) {
    if (element.id !== '')
      return '#' + this.escapeCssSelector(element.id);

    var names = [];
    while (element.parentElement) {
      if (element.id) {
        names.unshift('#' + this.escapeCssSelector(element.id));
        break;
      } else {
        if (element === element.ownerDocument.documentElement)
          names.unshift(element.tagName.toLowerCase());
        else {
          var c = 1;
          for (var e = element; e.previousElementSibling; e = e.previousElementSibling) {
            c++;
          }
          names.unshift(element.tagName.toLowerCase() + ':nth-child(' + c + ')');
        }
        element = element.parentElement;
      }
    }
    return names.join(' > ');
  }

  /**
   * Escape CSS selector special characters
   */
  escapeCssSelector(str) {
    return str.replace(/[!"#$%&'()*+,.\/\:;?@[\\\]^`{|}~]/g, '\\$&');
  }

  /**
   * Escape text for locators
   */
  escapeText(str) {
    return str.replace(/"/g, '\\"').replace(/\n/g, ' ');
  }

  /**
   * Extract all interactive elements - IMPROVED
   */
  extractInteractiveElements() {
    const selectors = [
      'button',          // All buttons
      'input',           // All inputs (text, email, password, checkbox, radio, etc)
      'select',          // All select dropdowns
      'textarea',        // All textareas
      'a',               // All links (removed [href] restriction)
      '[role="button"]', // ARIA buttons
      '[role="combobox"]', // ARIA dropdowns
      '[role="menuitem"]', // ARIA menu items
      '[role="link"]',   // ARIA links
      '[tabindex]',      // Tab-navigable elements
      '[onclick]',       // Click handlers
    ];

    // Get all elements matching selectors
    const allElements = Array.from(
      new Set(
        selectors.flatMap(selector => {
          try {
            return Array.from(this.document.querySelectorAll(selector));
          } catch (e) {
            console.warn(`Selector failed: ${selector}`);
            return [];
          }
        })
      )
    );

    // Filter out hidden elements and elements with tabindex="-1"
    const visibleElements = allElements.filter(el => {
      if (el.getAttribute('tabindex') === '-1') return false;
      
      const style = this.document.defaultView?.getComputedStyle?.(el);
      if (style && (style.display === 'none' || style.visibility === 'hidden')) {
        return false;
      }
      
      return true;
    });

    return visibleElements.map((el, index) => {
      const tag = el.tagName.toLowerCase();
      const id = el.id || null;
      const name = el.name || null;
      const type = el.type || null;
      const text = el.innerText?.substring(0, 100)?.trim() || null;
      const placeholder = el.placeholder || null;
      const ariaLabel = el.getAttribute('aria-label') || null;
      const testId = el.getAttribute('data-testid') || null;

      return {
        index,
        tag,
        id,
        name,
        type,
        text,
        placeholder,
        ariaLabel,
        testId,
        selector: this.generateSelector(el),
        playwrightLocator: this.generatePlaywrightLocator(el),
      };
    });
  }

  /**
   * Generate Playwright test code
   */
  generatePlaywrightCode() {
    const elements = this.extractInteractiveElements();

    const code = `
import { test, expect } from '@playwright/test';

test('interact with page elements', async ({ page }) => {
  await page.goto('YOUR_URL_HERE');

  // Interactive elements found:
${elements
  .map(
    (el) => `
  // ${el.tag.toUpperCase()} - ${el.text || el.placeholder || el.ariaLabel || 'Element ' + el.index}
  const element${el.index} = page.${el.playwrightLocator};
  // await element${el.index}.click();
`
  )
  .join('')}
});
`;

    return code;
  }

  /**
   * Generate JSON output
   */
  toJSON() {
    return {
      totalElements: this.extractInteractiveElements().length,
      elements: this.extractInteractiveElements(),
      timestamp: new Date().toISOString(),
    };
  }
}

module.exports = DOMToPlaywrightLocators;
