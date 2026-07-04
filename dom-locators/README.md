# 🎯 DOM to Playwright Locators Generator

Automatically convert DOM HTML to efficient **Playwright locators** for all interactive elements (buttons, dropdowns, fields, links, etc.).

## ✨ Features

- **Automatic Locator Generation** - Converts DOM to Playwright locators instantly
- **Multiple Locator Strategies**:
  - Role-based locators (most accessible: `getByRole()`)
  - Label-based locators (`getByLabel()`)
  - Placeholder-based locators (`getByPlaceholder()`)
  - Text-based locators (`getByText()`)
  - CSS selectors (fallback)

- **Identifies All Interactive Elements**:
  - ✅ Buttons (`<button>`, `<input type="button">`, `[role="button"]`)
  - ✅ Input fields (`<input>`, `<textarea>`)
  - ✅ Dropdowns (`<select>`, `[role="combobox"]`)
  - ✅ Links (`<a href>`)
  - ✅ Checkboxes & Radio buttons
  - ✅ ARIA-labeled elements

- **Multiple Output Formats**:
  - 📋 Elements list with locators
  - 🧪 Ready-to-use Playwright test code
  - 📊 JSON format for programmatic use

- **Web Interface** - Paste HTML and get locators instantly
- **REST API** - Integrate into your automation workflows
- **Statistics** - See breakdown of element types found

## 🚀 Quick Start

### Installation

```bash
cd dom-locators
npm install
```

### Running the Server

```bash
npm start
```

Server will start at `http://localhost:3000`

### Development Mode

```bash
npm run dev
```

## 📖 How to Use

### Step 1: Start the Server
```bash
npm start
```

### Step 2: Open Web Interface
Go to `http://localhost:3000` in your browser

### Step 3: Paste HTML
Copy and paste your HTML code in the left panel

### Step 4: Generate Locators
Click the "Generate Locators" button

### Step 5: View Results
Check the results in three formats:
- **Elements Tab** - Individual elements with locators
- **Test Code Tab** - Ready-to-use Playwright test
- **JSON Tab** - Raw data for integration

## 📊 Example

### Input HTML
```html
<form>
  <label for="email">Email</label>
  <input type="email" id="email" placeholder="Enter email" />
  
  <label for="country">Country</label>
  <select id="country" aria-label="Select your country">
    <option>USA</option>
    <option>UK</option>
  </select>
  
  <button type="submit">Sign Up</button>
</form>
```

### Generated Locators

```javascript
page.getByLabel('Email')
page.getByPlaceholder('Enter email')
page.getByRole('combobox', { name: 'Select your country' })
page.getByRole('button', { name: 'Sign Up' })
```

### Playwright Test Code

```typescript
import { test, expect } from '@playwright/test';

test('interact with page elements', async ({ page }) => {
  await page.goto('YOUR_URL_HERE');

  // INPUT - Email
  const element0 = page.getByLabel('Email');
  // await element0.fill('test@example.com');

  // SELECT - Select your country
  const element1 = page.getByRole('combobox', { name: 'Select your country' });
  // await element1.selectOption('USA');

  // BUTTON - Sign Up
  const element2 = page.getByRole('button', { name: 'Sign Up' });
  // await element2.click();
});
```

## 🔌 REST API

### Generate Locators (JSON)

```bash
curl -X POST http://localhost:3000/api/generate/json \
  -H "Content-Type: application/json" \
  -d '{"html":"<button>Login</button>"}'
```

Response:
```json
{
  "success": true,
  "elements": [
    {
      "tag": "button",
      "text": "Login",
      "playwrightLocator": "getByRole('button', { name: 'Login' })"
    }
  ],
  "total": 1
}
```

### Generate Test Code

```bash
curl -X POST http://localhost:3000/api/generate/code \
  -H "Content-Type: application/json" \
  -d '{"html":"<button>Login</button>"}'
```

### Generate All Data

```bash
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{"html":"<button>Login</button>"}'
```

## 📦 Project Structure

```
dom-locators/
├── index.js              # Core DOM analyzer & locator generator
├── server.js             # Express API server
├── package.json          # Dependencies
├── README.md             # Documentation
└── public/
    └── index.html        # Web interface
```

## 🎯 Locator Priority

The generator uses this priority order:

1. **Role-based** (most accessible): `getByRole('button', { name: 'Click' })`
2. **Label-based**: `getByLabel('Email')`
3. **Placeholder-based**: `getByPlaceholder('Enter email')`
4. **Text-based**: `getByText('Click')`
5. **CSS selectors** (fallback): `#element-id` or `[name="field"]`

## 🔍 Supported Elements

| Element | Detection | Locator Type |
|---------|-----------|---------------|
| `<button>` | Tag name | Role-based |
| `<input type="text">` | Type attribute | Placeholder/CSS |
| `<input type="email">` | Type attribute | Placeholder/CSS |
| `<input type="checkbox">` | Type attribute | Role-based |
| `<input type="radio">` | Type attribute | Role-based |
| `<select>` | Tag name | Role-based |
| `<textarea>` | Tag name | Label/CSS |
| `<a>` | Tag name | Role-based |
| `[role="button"]` | ARIA role | Role-based |
| `[role="combobox"]` | ARIA role | Role-based |

## 💡 Tips

- **Use Labels**: Always add `<label>` tags for inputs for better locators
- **ARIA Attributes**: Use `aria-label` for custom interactive elements
- **Data-testid**: Add `data-testid` for elements without labels
- **Meaningful Text**: Button text is used for identification
- **Keyboard Shortcut**: Press `Ctrl+Enter` or `Cmd+Enter` to generate

## 🛠️ API Reference

### Methods

#### `extractInteractiveElements()`
Returns array of all interactive elements with locators.

#### `generatePlaywrightCode()`
Generates Playwright test template.

#### `generateSelector(element)`
Generates optimal CSS selector.

#### `generatePlaywrightLocator(element)`
Generates Playwright locator syntax.

#### `toJSON()`
Returns complete data as JSON.

---

**Made with ❤️ for test automation**
