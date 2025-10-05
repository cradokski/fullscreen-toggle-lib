export type FullscreenStatus = 'entered' | 'exited';
export type FullscreenCallback = (isFullscreen: boolean, element: Element | null) => void;

export interface FullscreenToggleOptions {
	element?: HTMLElement;
	requireDoubleTap?: boolean;
	delayMs?: number;
}

const subscriberSet = new Set<FullscreenCallback>();
let isListening = false;

let lastTapTime: number | null = null;


// --- API: fullscreenToggle with overloads ---

export function fullscreenToggle(): Promise<FullscreenStatus>;
export function fullscreenToggle(element: HTMLElement): Promise<FullscreenStatus>;
export function fullscreenToggle(options: FullscreenToggleOptions): Promise<FullscreenStatus>;

/**
 * Toggles fullscreen mode on the given element or the document's root element (if omitted).
 *
 * If the `requireDoubleTap` option is set to `true`, a double-tap (or double-click) is required
 * to toggle fullscreen mode. If the time between two taps is less than `delayMs` milliseconds,
 * the double-tap is considered valid and the fullscreen mode is toggled. Otherwise, the second
 * tap is ignored.
 *
 * @param {HTMLElement | FullscreenToggleOptions} [arg] The element to toggle fullscreen on, or an options object
 * @param {boolean} [arg.requireDoubleTap=false] Whether to require a double-tap to toggle fullscreen
 * @param {number} [arg.delayMs=300] The maximum allowed time between two taps for a double-tap
 * @returns {Promise<FullscreenStatus>} A promise that resolves with the new fullscreen status
 */
export function fullscreenToggle(arg?: HTMLElement | FullscreenToggleOptions): Promise<FullscreenStatus> {
	let element: HTMLElement = document.documentElement;
	let requireDoubleTap = false;
	let delayMs = 300;

	if (arg instanceof HTMLElement) {
		element = arg;
	} else if (typeof arg === 'object' && arg !== null) {
		element = arg.element ?? document.documentElement;
		requireDoubleTap = arg.requireDoubleTap ?? false;
		delayMs = arg.delayMs ?? 300;
	}

	const now = Date.now();
	if (requireDoubleTap) {
		if (lastTapTime !== null && now - lastTapTime < delayMs) {
			lastTapTime = 0;
			return isFullscreen() ? exitFullscreen() : enterFullscreen(element);
		} else {
			lastTapTime = now;
			return Promise.resolve(isFullscreen() ? 'entered' : 'exited');
		}
	}

	return isFullscreen() ? exitFullscreen() : enterFullscreen(element);
}

// --- Watchers: Subscribe to fullscreen change events ---
/**
 * Subscribes to fullscreen change events and calls the provided callback immediately with the current state and whenever the state changes.
 * Returns a function that can be used to unsubscribe from the events.
 * If there are no more subscribers, it will also automatically remove the event listeners.
 * @param callback The callback that will be called when the fullscreen state changes
 * @returns An unsubscribe function
 */
export function watchFullscreen(callback: FullscreenCallback): () => void {
	subscriberSet.add(callback);
	callback(isFullscreen(), getFullscreenElement());

	if (!isListening) {
		['fullscreenchange', 'webkitfullscreenchange', 'mozfullscreenchange', 'MSFullscreenChange'].forEach(event =>
			document.addEventListener(event, handleFullscreenEvent)
		);
		isListening = true;
	}

	return () => {
		subscriberSet.delete(callback);
		if (subscriberSet.size === 0 && isListening) {
			['fullscreenchange', 'webkitfullscreenchange', 'mozfullscreenchange', 'MSFullscreenChange'].forEach(event =>
				document.removeEventListener(event, handleFullscreenEvent)
			);
			isListening = false;
		}
	};
}
/**
 * Returns true if the document is currently in fullscreen mode, false otherwise.
 *
 * @returns {boolean} Whether the document is in fullscreen mode
 */
export function isFullscreen(): boolean {
	return !!getFullscreenElement();
}

// --- Internal: Fullscreen State Utilities ---

function handleFullscreenEvent() {
	const el = getFullscreenElement();
	const state = !!el;
	subscriberSet.forEach((cb) => cb(state, el));
}
function getFullscreenElement(): Element | null {
	return document.fullscreenElement ||
		(document as any).webkitFullscreenElement ||
		(document as any).mozFullScreenElement ||
		(document as any).msFullscreenElement || null;
}

function enterFullscreen(element: HTMLElement = document.documentElement): Promise<FullscreenStatus> {
	const request = element.requestFullscreen ||
		(element as any).webkitRequestFullscreen ||
		(element as any).mozRequestFullScreen ||
		(element as any).msRequestFullscreen;

	if (request) {
		return request.call(element).then?.(() => 'entered') || Promise.resolve('entered');
	}

	return Promise.reject(new Error('Fullscreen API not supported'));
}

function exitFullscreen(): Promise<FullscreenStatus> {
	const exit = document.exitFullscreen ||
		(document as any).webkitExitFullscreen ||
		(document as any).mozCancelFullScreen ||
		(document as any).msExitFullscreen;

	if (exit) {
		return exit.call(document).then?.(() => 'exited') || Promise.resolve('exited');
	}

	return Promise.reject(new Error('Fullscreen API not supported'));
}

/**
 * Resets internal double-tap tracking state.
 *
 * This is a utility function that should only be used in tests.
 */
export function __resetFullscreenTapState() {
	lastTapTime = null;
}