import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
	fullscreenToggle,
	watchFullscreen,
	isFullscreen,
	__resetFullscreenTapState // ✅ resets tap tracking state
} from './fullscreen';
import {
	clearFullscreenState,
	simulateDoubleTap,
	simulateSlowTap,
} from './fullscreen.test.utils.js';

describe('fullscreen utilities', () => {
	let mockElement: HTMLElement;

	beforeEach(() => {
		mockElement = document.createElement('div');
		clearFullscreenState();
		__resetFullscreenTapState(); // ✅ Reset internal double-tap state
		vi.useFakeTimers(); // ✅ fake time control
		mockElement.requestFullscreen = vi.fn().mockResolvedValue(undefined);
		(mockElement as any).webkitRequestFullscreen = vi.fn().mockResolvedValue(undefined);
		(document as any).exitFullscreen = vi.fn().mockResolvedValue(undefined);
	});

	afterEach(() => {
		vi.restoreAllMocks();
		clearFullscreenState();
		vi.useRealTimers(); // ✅ restore after each test
	});

	it('should detect fullscreen state (false)', () => {
		expect(isFullscreen()).toBe(false);
	});

	it('should detect fullscreen state (true)', () => {
		(document as any).fullscreenElement = mockElement;
		expect(isFullscreen()).toBe(true);
	});

	it('should enter fullscreen when not in fullscreen', async () => {
		const status = await fullscreenToggle(mockElement);
		expect(status).toBe('entered');
		expect(mockElement.requestFullscreen).toHaveBeenCalled();
	});

	it('should exit fullscreen when already in fullscreen', async () => {
		(document as any).fullscreenElement = mockElement;
		const status = await fullscreenToggle();
		expect(status).toBe('exited');
		expect((document as any).exitFullscreen).toHaveBeenCalled();
	});

	it('should trigger callback immediately in watchFullscreen and on event', () => {
		const callback = vi.fn();

		const unsubscribe = watchFullscreen(callback);

		expect(callback).toHaveBeenCalledTimes(1);
		expect(callback).toHaveBeenCalledWith(false, null);

		(document as any).fullscreenElement = mockElement;
		document.dispatchEvent(new Event('fullscreenchange'));

		expect(callback).toHaveBeenCalledTimes(2);
		expect(callback).toHaveBeenLastCalledWith(true, mockElement);

		unsubscribe();
	});

	it('should unsubscribe correctly from watchFullscreen', () => {
		const callback = vi.fn();
		const unsubscribe = watchFullscreen(callback);
		unsubscribe();

		(document as any).fullscreenElement = mockElement;
		document.dispatchEvent(new Event('fullscreenchange'));

		expect(callback).toHaveBeenCalledTimes(1);
	});

	it('should keep DOM listener until all subscribers are removed', () => {
		const cb1 = vi.fn();
		const cb2 = vi.fn();

		const unsubscribe1 = watchFullscreen(cb1);
		const unsubscribe2 = watchFullscreen(cb2);

		expect(cb1).toHaveBeenCalledTimes(1);
		expect(cb2).toHaveBeenCalledTimes(1);

		(document as any).fullscreenElement = mockElement;
		document.dispatchEvent(new Event('fullscreenchange'));

		expect(cb1).toHaveBeenCalledTimes(2);
		expect(cb2).toHaveBeenCalledTimes(2);

		unsubscribe1();

		(document as any).fullscreenElement = null;
		document.dispatchEvent(new Event('fullscreenchange'));

		expect(cb1).toHaveBeenCalledTimes(2);
		expect(cb2).toHaveBeenCalledTimes(3);

		unsubscribe2();

		(document as any).fullscreenElement = mockElement;
		document.dispatchEvent(new Event('fullscreenchange'));

		expect(cb1).toHaveBeenCalledTimes(2);
		expect(cb2).toHaveBeenCalledTimes(3);
	});

	it('should not toggle fullscreen on first tap when requireDoubleTap is true', async () => {
		const result = await fullscreenToggle({ element: mockElement, requireDoubleTap: true });
		expect(result).toBe('exited'); // Correct: fullscreen was off, no toggle yet
		expect(mockElement.requestFullscreen).not.toHaveBeenCalled();
	});

	it('should toggle fullscreen on simulateDoubleTap()', async () => {
		const status = await simulateDoubleTap(mockElement);
		expect(status).toBe('entered');
		expect(mockElement.requestFullscreen).toHaveBeenCalled();
	});

	it('should not toggle fullscreen on simulateSlowTap()', async () => {
		clearFullscreenState();
		vi.clearAllMocks();

		mockElement.requestFullscreen = vi.fn().mockResolvedValue(undefined);

		const result = await simulateSlowTap(mockElement, { delayMs: 100 });

		expect(result).toBe('exited'); // Should not toggle
		expect(mockElement.requestFullscreen).not.toHaveBeenCalled(); // ✅ Should pass now
	});


	it('should respect custom delayMs in simulateDoubleTap()', async () => {
		const status = await simulateDoubleTap(mockElement, { delayMs: 500 });
		expect(status).toBe('entered'); // Should toggle to fullscreen
		expect(mockElement.requestFullscreen).toHaveBeenCalled();
	});
});
