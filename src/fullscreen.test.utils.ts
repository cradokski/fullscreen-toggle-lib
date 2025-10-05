import type { FullscreenStatus } from './fullscreen.js';
import { fullscreenToggle } from './fullscreen.js';
import { vi } from 'vitest';

// Clears mocked fullscreen state across all known vendor prefixes
export function clearFullscreenState(): void {
	delete (document as any).fullscreenElement;
	delete (document as any).webkitFullscreenElement;
	delete (document as any).mozFullScreenElement;
	delete (document as any).msFullscreenElement;
}

// Simulates a successful double-tap within the delay window
export async function simulateDoubleTap(
	element: HTMLElement,
	options: { delayMs?: number } = {}
) {
	const delay = options.delayMs ?? 300;

	await fullscreenToggle({ element, requireDoubleTap: true, delayMs: delay });

	vi.advanceTimersByTime(delay - 50); // ✅ fast enough for double tap

	return fullscreenToggle({ element, requireDoubleTap: true, delayMs: delay });
}
// Simulates a second tap too late — should not toggle fullscreen
export async function simulateSlowTap(
	element: HTMLElement,
	options: { delayMs?: number } = {}
) {
	const delay = options.delayMs ?? 300;

	await fullscreenToggle({ element, requireDoubleTap: true, delayMs: delay });

	vi.advanceTimersByTime(delay + 100); // ✅ skip delay instantly

	return fullscreenToggle({ element, requireDoubleTap: true, delayMs: delay });
}

