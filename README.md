[![Issues](https://img.shields.io/github/issues/cradokski/fullscreen-toggle-lib)](https://github.com/cradokski/fullscreen-toggle-lib/issues)

# fullscreen-toggle-lib

> A lightweight, cross-browser fullscreen utility library for web apps — framework-agnostic and TypeScript-first. **Double Tap** optional.

---

## ✨ Features

- ✅ Toggle fullscreen on any element  
- ✅ Optional **double-tap** support — prevent accidental toggles  
- 🆕 **Ensure** fullscreen is active without toggling  
- 🆕 **Ensure** fullscreen is exited without toggling  
- ✅ Watch fullscreen enter/exit events  
- ✅ Framework-agnostic: works with Angular, React, Vue, Svelte, and plain JS  
- ✅ Cross-browser support (Chrome, Firefox, Safari, Edge)  
- ✅ TypeScript native with full IntelliSense  
- ✅ Singleton design (no need to instantiate anything)  

---

## 📊 When to Use Which Function

| Use Case                                 | Recommended Function       | Behavior                                               |
| ---------------------------------------- | -------------------------- | ------------------------------------------------------ |
| Toggle fullscreen on user click          | `fullscreenToggle()`       | Switches between enter/exit depending on current state |
| Always enter fullscreen (if not already) | `ensureFullscreen()`       | Enters fullscreen only if not already in it            |
| Always exit fullscreen                   | `ensureExitedFullscreen()` | Exits fullscreen only if currently active              |
| React to fullscreen changes (any source) | `watchFullscreen()`        | Subscribe to enter/exit events                         |
| Check current state manually             | `isFullscreen()`           | Returns a boolean                                      |

---

## 🚀 Installation

```bash
npm install fullscreen-toggle-lib
# or
yarn add fullscreen-toggle-lib
````

---

### Angular Example

**app.component.html**

```html
<div class="container">
  <p>
    <button (click)="_fullscreenToggle()">
      1 Click</button>
  </p>
  <p>
    <button (click)="_fullscreenToggle({requireDoubleTap: true})">
      2 Click
    </button>
  </p>
  <p>
    <button (click)="_fullscreenToggle(fsOptions)">
      Click specify options</button>
  </p>
  <p>
    <button (click)="_ensureFullscreen()">
      Ensure FS mode
    </button>
  </p>
  <p>
    <button (click)="_ensureExitedFullscreen()">
      Ensure Normal mode
    </button>
  </p>
  <p>
    FS mode {{ _isFullscreen() ? 'ON' : 'OFF'}}
  </p>
</div>
```

**app.component.ts**

```typescript
import {
  fullscreenToggle,
  ensureFullscreen,
  ensureExitedFullscreen,
  watchFullscreen,
  isFullscreen
} from 'fullscreen-toggle-lib';

@Component({ /* ... */ })
export class AppComponent implements OnInit, OnDestroy {
  protected _fullscreenToggle = fullscreenToggle;
  protected _isFullscreen = isFullscreen;
  protected _ensureExitedFullscreen = ensureExitedFullscreen;
  protected _ensureFullscreen = ensureFullscreen;
  private _unsubscribeWatch!: () => void;
  protected fsOptions: FullscreenToggleOptions = {
    element: document.documentElement,// default element to toggle
    requireDoubleTap: false, // default no double tap required
    delayMs: 300, // default delay for double tap detection
  }
  ngOnInit() {
    this._unsubscribeWatch = watchFullscreen((fs) =>
      console.log('Fullscreen:', fs)
    );
  }

  ngOnDestroy() {
    this._unsubscribeWatch();
  }
}
```


## 📘 API Reference

### **fullscreenToggle(elementOrOptions?): Promise<'entered' | 'exited'>**

Toggles fullscreen mode:

* 📥 Enters fullscreen if not already active
* 📤 Exits if already fullscreen
* 🎯 Optionally provide a specific element or `FullscreenToggleOptions`

---

### **ensureFullscreen(element?: HTMLElement): Promise<'entered' | 'already-fullscreen'>**

Forces fullscreen **on**, only if not already active:

* ✅ Does nothing if fullscreen is already active
* 📥 Enters fullscreen otherwise

---

### **ensureExitedFullscreen(): Promise<'exited' | 'already-exited'>**

Forces fullscreen **off**, only if currently active:

* ✅ Does nothing if not in fullscreen
* 📤 Exits fullscreen otherwise

---

### **watchFullscreen(callback): () => void**

Watches fullscreen state changes:

* ⚡ Calls your callback immediately with current state
* 🔄 Listens for future `fullscreenchange` events
* 🛑 Returns an unsubscribe function
* 👥 Supports multiple subscribers safely

---

### **isFullscreen(): boolean**

Returns `true` if the document is currently in fullscreen mode.

---


## ⚙️ FullscreenToggleOptions

| Option             | Type          | Default                    | Description                                            |
| ------------------ | ------------- | -------------------------- | ------------------------------------------------------ |
| `element`          | `HTMLElement` | `document.documentElement` | The element to toggle fullscreen on                    |
| `requireDoubleTap` | `boolean`     | `false`                    | If `true`, requires a double-tap to trigger fullscreen |
| `delayMs`          | `number`      | `300`                      | Max allowed delay (in ms) between two taps             |

### Example

```typescript
const options: FullscreenToggleOptions = {
  element: document.documentElement, // default value
  requireDoubleTap: true,            // default false
  delayMs: 500                       // default 300
};
```
---

## 🐞 Issues

Report bugs or request features here:
👉 [GitHub Issues](https://github.com/cradokski/fullscreen-toggle-lib/issues)

---

## 📝 License

MIT License - Copyright (c) 2025 Colin Craddock


