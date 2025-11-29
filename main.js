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

// PS position is controlled via CSS.

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

// Minimal controller lifecycle
const manager = new ControllerManager(updateUI, () => {}, () => {});
manager.startPolling();

// Focus window when clicking the skin
if (ui.gv && ui.gv.controller) {
    ui.gv.controller.addEventListener('click', () => { window.focus(); });
}
