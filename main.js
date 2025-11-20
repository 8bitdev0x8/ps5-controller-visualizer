import { ControllerManager, MAPPING } from './controller.js';

const ui = {
    status: document.getElementById('connection-status'),
    statusText: document.querySelector('.status-text'),

    // Buttons
    cross: document.getElementById('btn-cross'),
    circle: document.getElementById('btn-circle'),
    square: document.getElementById('btn-square'),
    triangle: document.getElementById('btn-triangle'),

    // D-Pad
    up: document.getElementById('btn-up'),
    down: document.getElementById('btn-down'),
    left: document.getElementById('btn-left'),
    right: document.getElementById('btn-right'),

    // Triggers/Bumpers
    l1: document.getElementById('btn-l1'),
    r1: document.getElementById('btn-r1'),
    l2: document.getElementById('btn-l2'),
    r2: document.getElementById('btn-r2'),
    l2Fill: document.getElementById('fill-l2'),
    r2Fill: document.getElementById('fill-r2'),

    // Sticks
    stickLeft: document.getElementById('stick-left'),
    stickRight: document.getElementById('stick-right'),

    // Meta
    share: document.getElementById('btn-share'),
    options: document.getElementById('btn-options'),
    ps: document.getElementById('btn-ps'),
    touchpad: document.getElementById('touchpad'),

    // Debug
    debug: document.getElementById('debug-output')
};

// Raw data UI elements (optional)
const rawToggle = document.getElementById('raw-toggle');
const rawOutput = document.getElementById('raw-output');
let lastRawUpdate = 0;
const RAW_THROTTLE_MS = 150; // throttle raw output updates to avoid spamming the UI

const updateUI = (gamepad) => {
    if (!gamepad) return;

    const btns = gamepad.buttons;
    const axes = gamepad.axes;

    // Helper to safely get button state
    const getButton = (index) => {
        return btns[index] || { pressed: false, value: 0 };
    };

    // Helper to safely get axis value
    const getAxis = (index) => {
        return axes[index] || 0;
    };

    // Helper to toggle class
    const toggle = (el, active) => {
        if (el) el.classList.toggle('active', active);
    };

    // Action Buttons
    toggle(ui.cross, getButton(MAPPING.BUTTONS.CROSS).pressed);
    toggle(ui.circle, getButton(MAPPING.BUTTONS.CIRCLE).pressed);
    toggle(ui.square, getButton(MAPPING.BUTTONS.SQUARE).pressed);
    toggle(ui.triangle, getButton(MAPPING.BUTTONS.TRIANGLE).pressed);

    // D-Pad
    toggle(ui.up, getButton(MAPPING.BUTTONS.UP).pressed);
    toggle(ui.down, getButton(MAPPING.BUTTONS.DOWN).pressed);
    toggle(ui.left, getButton(MAPPING.BUTTONS.LEFT).pressed);
    toggle(ui.right, getButton(MAPPING.BUTTONS.RIGHT).pressed);

    // Bumpers
    toggle(ui.l1, getButton(MAPPING.BUTTONS.L1).pressed);
    toggle(ui.r1, getButton(MAPPING.BUTTONS.R1).pressed);

    // Triggers (Analog)
    const l2Value = getButton(MAPPING.BUTTONS.L2).value;
    const r2Value = getButton(MAPPING.BUTTONS.R2).value;

    if (ui.l2Fill) ui.l2Fill.style.height = `${l2Value * 100}%`;
    if (ui.r2Fill) ui.r2Fill.style.height = `${r2Value * 100}%`;

    // Meta
    toggle(ui.share, getButton(MAPPING.BUTTONS.SHARE).pressed);
    toggle(ui.options, getButton(MAPPING.BUTTONS.OPTIONS).pressed);
    toggle(ui.ps, getButton(MAPPING.BUTTONS.PS).pressed);
    toggle(ui.touchpad, getButton(MAPPING.BUTTONS.TOUCHPAD).pressed);

    // Sticks
    // Axes are usually -1 to 1. We need to translate that to CSS transform.
    // Max movement in pixels (approximate to stick container size)
    const maxMove = 20;

    const lx = getAxis(MAPPING.AXES.LEFT_X) * maxMove;
    const ly = getAxis(MAPPING.AXES.LEFT_Y) * maxMove;
    const rx = getAxis(MAPPING.AXES.RIGHT_X) * maxMove;
    const ry = getAxis(MAPPING.AXES.RIGHT_Y) * maxMove;

    if (ui.stickLeft) ui.stickLeft.style.transform = `translate(${lx}px, ${ly}px)`;
    if (ui.stickRight) ui.stickRight.style.transform = `translate(${rx}px, ${ry}px)`;

    // Stick Clicks (L3/R3)
    const l3Pressed = getButton(MAPPING.BUTTONS.L3).pressed;
    const r3Pressed = getButton(MAPPING.BUTTONS.R3).pressed;

    if (ui.stickLeft) {
        if (l3Pressed) ui.stickLeft.classList.add('pressed');
        else ui.stickLeft.classList.remove('pressed');
    }

    if (ui.stickRight) {
        if (r3Pressed) ui.stickRight.classList.add('pressed');
        else ui.stickRight.classList.remove('pressed');
    }
};

// Show throttled raw data when toggle is enabled
const showRawData = (gamepad) => {
    if (!rawToggle || !rawToggle.checked) {
        if (rawOutput) rawOutput.textContent = '';
        return;
    }

    const now = Date.now();
    if (now - lastRawUpdate < RAW_THROTTLE_MS) return;
    lastRawUpdate = now;

    try {
        // Build a plain object to avoid browser-specific prototypes and circular refs
        const plain = {
            id: gamepad.id,
            index: gamepad.index,
            mapping: gamepad.mapping,
            timestamp: gamepad.timestamp,
            axes: Array.from(gamepad.axes || []),
            buttons: (gamepad.buttons || []).map(b => ({ pressed: !!b.pressed, value: b.value }))
        };
        if (rawOutput) rawOutput.textContent = JSON.stringify(plain, null, 2);
    } catch (e) {
        if (rawOutput) rawOutput.textContent = 'Error serializing gamepad data: ' + e.message;
    }
};

const log = (msg) => {
    const time = new Date().toLocaleTimeString();
    ui.debug.textContent = `[${time}] ${msg}\n` + ui.debug.textContent;
    console.log(msg);
};

const onConnect = (gamepad) => {
    ui.status.classList.add('connected');
    ui.status.classList.remove('disconnected');
    ui.statusText.textContent = `Connected: ${gamepad.id.substring(0, 20)}...`;
    log(`Connected: ${gamepad.id} (Index: ${gamepad.index})`);
    log(`Mapping: "${gamepad.mapping}"`);

    if (gamepad.mapping !== 'standard') {
        log('WARNING: Mapping is not "standard". Buttons may be scrambled.');
        log('Try using Chrome/Edge which usually normalizes PS5 controllers.');
    }
};

const onDisconnect = () => {
    ui.status.classList.remove('connected');
    ui.status.classList.add('disconnected');
    ui.statusText.textContent = 'Connect Controller';
    log('Disconnected');
};

// Combine visual update and raw-data display into a single callback
const combinedUpdate = (gamepad) => {
    updateUI(gamepad);
    showRawData(gamepad);
};

const manager = new ControllerManager(combinedUpdate, onConnect, onDisconnect);


// Override manager's internal console.log if we want, or just rely on events.
// Let's manually check gamepads on scan and log them.
document.getElementById('scan-btn').addEventListener('click', () => {
    log('Scanning for gamepads...');
    const gamepads = navigator.getGamepads();
    let found = false;
    for (let i = 0; i < gamepads.length; i++) {
        const gp = gamepads[i];
        if (gp) {
            log(`Found gamepad at index ${i}: ${gp.id}`);
            found = true;
            // Force connect if not already
            if (manager.gamepadIndex !== i) {
                manager.handleConnect({ gamepad: gp });
            }
        } else {
            log(`Index ${i}: null`);
        }
    }
    if (!found) {
        log('No gamepads found. Press buttons on controller!');
    }
    manager.scanGamepads();
});



// HID connect button removed from UI; WebHID support removed from controller manager.

// Always start polling
manager.startPolling();
log('App initialized. Waiting for controller...');

// Focus tracking
window.addEventListener('focus', () => {
    log('Window FOCUSED. Press buttons on controller now!');
    document.body.classList.remove('blurred');
    manager.scanGamepads();
});

window.addEventListener('blur', () => {
    log('Window BLURRED. Gamepad input may be ignored by browser.');
    document.body.classList.add('blurred');
});

// Initial check
if (document.hasFocus()) {
    log('Window is focused.');
} else {
    log('Window is NOT focused. Click here!');
}
