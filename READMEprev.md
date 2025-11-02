[![Issues](https://img.shields.io/github/issues/cradokski/fullscreen-toggle-lib)](https://github.com/cradokski/fullscreen-toggle-lib/issues)

# fullscreen-toggle-lib

> A lightweight, cross-browser fullscreen utility library for web apps — framework-agnostic and TypeScript-first. **Double Tap** optional.

---

## ✨ Features

- 🆕 Optional **double-tap** support — prevent accidental toggles
- ✅ Toggle fullscreen on any element
- ✅ Watch fullscreen enter/exit events
- ✅ Framework-agnostic: works with Angular, React, Vue, Svelte, and plain JS
- ✅ Cross-browser support (Chrome, Firefox, Safari, Edge)
- ✅ TypeScript native with full IntelliSense
- ✅ Singleton design (no need to instantiate anything)

---

## 🚀 Installation

```bash
npm install fullscreen-toggle-lib
# or
yarn add fullscreen-toggle-lib
```

---

### Angular Example

**app.component.html**
```html
<div class="container">
  <div (click)="_fullscreenToggle({requireDoubleTap: true})">
    **2 Clicks**
  </div>
  <div (click)="_fullscreenToggle()">
    **1 Click**</div>
  <span>
    **fs mode** {{_isFullscreen() ? 'ON' : 'OFF'}}
  </span>
</div>
```

**app.component.ts**
```typescript
import { fullscreenToggle, watchFullscreen, isFullscreen } from 'fullscreen-toggle-lib';

@Component({ /* ... */ })
export class AppComponent implements OnInit, OnDestroy {
  protected _fullscreenToggle = fullscreenToggle;
  protected _isFullscreen = isFullscreen;
  private _unsubscribeWatch!: () => void;

  // Console-log fullscreen state each time it changes
  ngOnInit() {
    this._unsubscribeWatch = watchFullscreen((fs) => console.log('Fullscreen:', fs));
  }

  ngOnDestroy() {
    this._unsubscribeWatch();
  }
}
```
---
## 📘 API Reference

**fullscreenToggle(element?: HTMLElement | FullscreenToggleOptions): Promise<'entered' | 'exited'>**  
&nbsp;&nbsp;&nbsp; - Toggles fullscreen mode:

- 📥 Enters fullscreen if not already active
- 📤 Exits if already fullscreen
- 🎯 Optionally provide a specific element to target


**watchFullscreen(callback: (isFullscreen: boolean, element: Element | null) => void): () => void**  
&nbsp;&nbsp;&nbsp; - Subscribes to fullscreen state changes:

- ⚡ Calls your callback immediately with current state
- 🔄 Listens for future changes
- 🛑 Returns an unsubscribe function
- 👥 Supports multiple subscribers safely

**isFullscreen(): boolean**  
&nbsp;&nbsp;&nbsp; - Returns true if currently in fullscreen mode.

---
## FullscreenToggleOptions

| Option             | Type          | Default                    | Description                                            |
| ------------------ | ------------- | -------------------------- | ------------------------------------------------------ |
| `element`          | `HTMLElement` | `document.documentElement` | The element to toggle fullscreen on                    |
| `requireDoubleTap` | `boolean`     | `false`                    | If `true`, requires a double-tap to trigger fullscreen |
| `delayMs`          | `number`      | `300`                      | Max allowed delay (in milliseconds) between two taps   |
# Example options object
```typescript
  const options: FullscreenToggleOptions = {
    element: document.documentElement,// is default value
    requireDoubleTap: true,// default value = false
    delayMs: 500,// is default value
  };
``` 
## 🐞 Issues

Report bugs or request features here:  
👉 [GitHub Issues](https://github.com/cradokski/fullscreen-toggle-lib/issues)

## 📝 License
None