/**
 * Controller mapping for standard gamepad layout (which PS5 uses via Bluetooth)
 * 
 * Standard Mapping:
 * B0: Cross (A)
 * B1: Circle (B)
 * B2: Square (X)
 * B3: Triangle (Y)
 * B4: L1
 * B5: R1
 * B6: L2 (Analog value in buttons[6].value)
 * B7: R2 (Analog value in buttons[7].value)
 * B8: Share/Select
 * B9: Options/Start
 * B10: L3 (Stick Click)
 * B11: R3 (Stick Click)
 * B12: D-Pad Up
 * B13: D-Pad Down
 * B14: D-Pad Left
 * B15: D-Pad Right
 * B16: PS Button
 * B17: Touchpad Click
 * 
 * Axes:
 * A0: Left Stick X
 * A1: Left Stick Y
 * A2: Right Stick X
 * A3: Right Stick Y
 */

export const MAPPING = {
    BUTTONS: {
        CROSS: 0,
        CIRCLE: 1,
        SQUARE: 2,
        TRIANGLE: 3,
        L1: 4,
        R1: 5,
        L2: 6,
        R2: 7,
        SHARE: 8,
        OPTIONS: 9,
        L3: 10,
        R3: 11,
        UP: 12,
        DOWN: 13,
        LEFT: 14,
        RIGHT: 15,
        PS: 16,
        TOUCHPAD: 17
    },
    AXES: {
        LEFT_X: 0,
        LEFT_Y: 1,
        RIGHT_X: 2,
        RIGHT_Y: 3
    }
};

export class ControllerManager {
    constructor(onUpdate, onConnect, onDisconnect) {
        this.onUpdate = onUpdate;
        this.onConnect = onConnect;
        this.onDisconnect = onDisconnect;
        this.pollingInterval = null;
        this.gamepadIndex = null;

        window.addEventListener("gamepadconnected", (e) => this.handleConnect(e));
        window.addEventListener("gamepaddisconnected", (e) => this.handleDisconnect(e));

        // Check for already connected gamepads (e.g. if page refreshed)
        this.scanGamepads();
    }

    scanGamepads() {
        const gamepads = navigator.getGamepads();
        for (const gamepad of gamepads) {
            if (gamepad) {
                this.handleConnect({ gamepad });
                break; // Just take the first one for now
            }
        }
    }

    handleConnect(e) {
        console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
            e.gamepad.index, e.gamepad.id,
            e.gamepad.buttons.length, e.gamepad.axes.length);

        // Prevent multiple connections for the same gamepad or overriding if we already have one
        if (this.gamepadIndex !== null && this.gamepadIndex !== e.gamepad.index) {
            return;
        }

        this.gamepadIndex = e.gamepad.index;
        this.startPolling();
        if (this.onConnect) this.onConnect(e.gamepad);
    }

    handleDisconnect(e) {
        console.log("Gamepad disconnected from index %d: %s",
            e.gamepad.index, e.gamepad.id);

        if (this.gamepadIndex === e.gamepad.index) {
            this.gamepadIndex = null;
            this.stopPolling();
            if (this.onDisconnect) this.onDisconnect();

            // Try to find another gamepad
            this.scanGamepads();
        }
    }

    startPolling() {
        if (!this.pollingInterval) {
            this.tick();
        }
    }

    stopPolling() {
        if (this.pollingInterval) {
            cancelAnimationFrame(this.pollingInterval);
            this.pollingInterval = null;
        }
    }


    tick() {
        this.pollingInterval = requestAnimationFrame(() => this.tick());

        if (this.gamepadIndex !== null) {
            const gamepads = navigator.getGamepads();
            const gamepad = gamepads[this.gamepadIndex];
            if (gamepad) {
                this.onUpdate(gamepad);
            }
        } else {
            // If we are polling but have no index, try to find one (polling for connection)
            const gamepads = navigator.getGamepads();
            for (const gp of gamepads) {
                if (gp) {
                    this.handleConnect({ gamepad: gp });
                    break;
                }
            }
        }
    }
}
