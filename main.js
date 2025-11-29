import { ControllerManager, MAPPING } from './controller.js';

const ui = {
    // GamepadViewer-style PS5 skin only
    gv: {
        controller: document.getElementById('gv-controller'),
        a: document.getElementById('gv-a'),
        b: document.getElementById('gv-b'),
        x: document.getElementById('gv-x'),
        y: document.getElementById('gv-y'),
        up: document.getElementById('gv-up'),
        down: document.getElementById('gv-down'),
        left: document.getElementById('gv-left'),
        right: document.getElementById('gv-right'),
        back: document.getElementById('gv-back'),
        start: document.getElementById('gv-start'),
        lb: document.getElementById('gv-lb'),
        rb: document.getElementById('gv-rb'),
        lt: document.getElementById('gv-lt'),
        rt: document.getElementById('gv-rt'),
        stickLeft: document.getElementById('gv-stick-left'),
        stickRight: document.getElementById('gv-stick-right'),
        touchpad: document.getElementById('gv-touchpad'),
        ps: document.getElementById('gv-ps')
    }
};

// Calibration storage keys
const PS_POS_KEY = 'gv-ps-pos';

// Apply saved PS position if available
(() => {
    const el = ui.gv?.ps;
    if (!el) return;
    try {
        const saved = JSON.parse(localStorage.getItem(PS_POS_KEY) || 'null');
        if (saved && typeof saved.left === 'number' && typeof saved.top === 'number') {
            el.style.left = `${saved.left}px`;
            el.style.top = `${saved.top}px`;
        }
    } catch {}
})();

// Simple calibration: Alt+Drag the PS marker to set exact overlay position
(() => {
    const el = ui.gv?.ps;
    if (!el) return;

    let dragging = false;
    let offsetX = 0;
    let offsetY = 0;

    const onMouseDown = (e) => {
        if (!e.altKey) return; // require Alt to avoid accidental drags
        dragging = true;
        const rect = el.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
        e.preventDefault();
    };

    const onMouseMove = (e) => {
        if (!dragging) return;
        const controllerRect = ui.gv.controller.getBoundingClientRect();
        const x = e.clientX - controllerRect.left - offsetX;
        const y = e.clientY - controllerRect.top - offsetY;
        el.style.left = `${Math.round(x)}px`;
        el.style.top = `${Math.round(y)}px`;
    };

    const onMouseUp = () => {
        if (!dragging) return;
        dragging = false;
        // Persist
        const left = parseInt(el.style.left || '0', 10);
        const top = parseInt(el.style.top || '0', 10);
        try {
            localStorage.setItem(PS_POS_KEY, JSON.stringify({ left, top }));
        } catch {}
    };

    el.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
})();

const updateUI = (gamepad) => {
    if (!gamepad) return;

    const btns = gamepad.buttons;
    const axes = gamepad.axes;

    const getButton = (index) => btns[index] || { pressed: false, value: 0 };
    const getAxis = (index) => axes[index] || 0;
    const toggle = (el, active) => { if (el) el.classList.toggle('active', active); };

    if (ui.gv && ui.gv.controller) {
        // Face buttons: PS5 layout mapping
        const aPressed = getButton(MAPPING.BUTTONS.CROSS).pressed;
        const bPressed = getButton(MAPPING.BUTTONS.CIRCLE).pressed;
        const xPressed = getButton(MAPPING.BUTTONS.SQUARE).pressed;
        const yPressed = getButton(MAPPING.BUTTONS.TRIANGLE).pressed;

        toggle(ui.gv.a, aPressed);
        toggle(ui.gv.b, bPressed);
        toggle(ui.gv.x, xPressed);
        toggle(ui.gv.y, yPressed);

        if (ui.gv.a) ui.gv.a.classList.toggle('pressed', aPressed);
        if (ui.gv.b) ui.gv.b.classList.toggle('pressed', bPressed);
        if (ui.gv.x) ui.gv.x.classList.toggle('pressed', xPressed);
        if (ui.gv.y) ui.gv.y.classList.toggle('pressed', yPressed);

        // D-Pad
        toggle(ui.gv.up, getButton(MAPPING.BUTTONS.UP).pressed);
        toggle(ui.gv.down, getButton(MAPPING.BUTTONS.DOWN).pressed);
        toggle(ui.gv.left, getButton(MAPPING.BUTTONS.LEFT).pressed);
        toggle(ui.gv.right, getButton(MAPPING.BUTTONS.RIGHT).pressed);

        // Back/Start (Share/Options)
        toggle(ui.gv.back, getButton(MAPPING.BUTTONS.SHARE).pressed);
        toggle(ui.gv.start, getButton(MAPPING.BUTTONS.OPTIONS).pressed);

        // Touchpad click indicator
        const touchpadPressed = getButton(MAPPING.BUTTONS.TOUCHPAD).pressed;
        toggle(ui.gv.touchpad, touchpadPressed);

        // PS button indicator
        const psPressed = getButton(MAPPING.BUTTONS.PS).pressed;
        toggle(ui.gv.ps, psPressed);

        // Bumpers
        const lbPressed = getButton(MAPPING.BUTTONS.L1).pressed;
        const rbPressed = getButton(MAPPING.BUTTONS.R1).pressed;
        toggle(ui.gv.lb, lbPressed);
        toggle(ui.gv.rb, rbPressed);
        if (ui.gv.lb) ui.gv.lb.classList.toggle('pressed', lbPressed);
        if (ui.gv.rb) ui.gv.rb.classList.toggle('pressed', rbPressed);

        // Triggers – show when value > 0
        const gvL2 = getButton(MAPPING.BUTTONS.L2).value;
        const gvR2 = getButton(MAPPING.BUTTONS.R2).value;
        if (ui.gv.lt) ui.gv.lt.style.opacity = gvL2 > 0.05 ? gvL2 : 0;
        if (ui.gv.rt) {
            ui.gv.rt.style.opacity = gvR2 > 0.05 ? gvR2 : 0;
            ui.gv.rt.classList.toggle('pressed', gvR2 > 0.98);
        }

        // Sticks – move visually
        const maxMoveGV = 15;
        const gvLx = getAxis(MAPPING.AXES.LEFT_X) * maxMoveGV;
        const gvLy = getAxis(MAPPING.AXES.LEFT_Y) * maxMoveGV;
        const gvRx = getAxis(MAPPING.AXES.RIGHT_X) * maxMoveGV;
        const gvRy = getAxis(MAPPING.AXES.RIGHT_Y) * maxMoveGV;

        if (ui.gv.stickLeft) ui.gv.stickLeft.style.transform = `translate(${gvLx}px, ${gvLy}px)`;
        if (ui.gv.stickRight) ui.gv.stickRight.style.transform = `translate(${gvRx}px, ${gvRy}px)`;

        // Stick clicks
        const l3Pressed = getButton(MAPPING.BUTTONS.L3).pressed;
        const r3Pressed = getButton(MAPPING.BUTTONS.R3).pressed;
        if (ui.gv.stickLeft) ui.gv.stickLeft.classList.toggle('pressed', l3Pressed);
        if (ui.gv.stickRight) ui.gv.stickRight.classList.toggle('pressed', r3Pressed);
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
    if (ui.debug) {
        ui.debug.textContent = `[${time}] ${msg}\n` + ui.debug.textContent;
    }
    console.log(msg);
};

// (Removed PS5 status/debug logic)
// Minimal controller lifecycle
const manager = new ControllerManager(updateUI, () => {}, () => {});
manager.startPolling();

// Focus window when clicking the skin
if (ui.gv && ui.gv.controller) {
    ui.gv.controller.addEventListener('click', () => { window.focus(); });
}
