// McF's Gamepad Keyboard Emulator 2021

// what this handy file does is "fake" keyboard events
// so that no changes to pre-existing wasd code are required
// ideally this provides zero work, automagic gamepad support\

// how to use:
// var gamepad = new GamepadManager();

// during gameplay loop:
// gamepad.update();

function GamepadManager() {
    if (!navigator.getGamepads) {
        console.error("Your browser does not allow the use of gamepads. Please change your browser settings if you want to use a gamepad.");
    }
    
    //console.log("Gamepad is supported");
    
    const DEADZONE = 0.15; // was 0.25
    var gamepad = null;
    var gamepad_left = false;
    var gamepad_right = false;
    var gamepad_up = false;
    var gamepad_down = false;
    var gamepad_b = false;
    var gamepad_a = false;
    var gamepad_x = false;
    var gamepad_y = false;
    var prev_gamepad_left = false;
    var prev_gamepad_right = false;
    var prev_gamepad_up = false;
    var prev_gamepad_down = false;
    var prev_gamepad_fire = false;
    var prev_gamepad_jump = false;
    var prev_gamepad_x = false;
    var prev_gamepad_y = false;
    
    // CHANGE THESE TO SUIT THE GAME KEYS
    var SIMULATED_KEY_UP = 38;//87;//w
    var SIMULATED_KEY_DOWN = 40;//83;//s
    var SIMULATED_KEY_LEFT = 37;//65;//a
    var SIMULATED_KEY_RIGHT = 39;//68;//d
    var SIMULATED_KEY_B_BUTTON = 88;//x
    var SIMULATED_KEY_A_BUTTON = 32;//space
    var SIMULATED_KEY_X_BUTTON = 88;//x
    var SIMULATED_KEY_Y_BUTTON = 88;//67;//C //90;//13;//enter
	
    window.addEventListener("gamepadconnected", function(e) {
    // Gamepad connected
    console.log("Gamepad connected", e.gamepad);
    });

    window.addEventListener("gamepaddisconnected", function(e) {
    // Gamepad disconnected
    console.log("Gamepad disconnected", e.gamepad);
    });

    this.applyDeadzone = function(number, threshold) {
        var percentage = (Math.abs(number) - threshold) / (1 - threshold);
        if(percentage < 0){
            percentage = 0;
        }
        return percentage * (number > 0 ? 1 : -1);
    }

    this.handle_gamepad = function() {
        if (!gamepad) {// always null until you press a button!
            if (!navigator.getGamepads)
            {
                if (!this.alreadyComplained) {
                    this.alreadyComplained = true;
                }
                return; // not supported?
            }
        }
        // poll every frame
        gamepad = navigator.getGamepads()[0];
        if (gamepad) {
            var joystickX = this.applyDeadzone(gamepad.axes[0], DEADZONE);
            gamepad_right = (joystickX > 0);
            gamepad_left = (joystickX < 0);
            var joystickY = this.applyDeadzone(gamepad.axes[1], DEADZONE);
            gamepad_down = (joystickY > 0);
            gamepad_up = (joystickY < 0);
            var butt = this.applyDeadzone(gamepad.buttons[0].value, DEADZONE);
            //gamepad_up = gamepad_up || (butt>0);
            gamepad_a = (butt>0);
            butt = this.applyDeadzone(gamepad.buttons[1].value, DEADZONE);
            gamepad_b = (butt>0);
            butt = this.applyDeadzone(gamepad.buttons[2].value, DEADZONE);
            gamepad_x = (butt>0);
            butt = this.applyDeadzone(gamepad.buttons[3].value, DEADZONE);
            gamepad_y = (butt>0);
        }

        // compare previous state and send fake keyboard events
        this.fake_keyboard_events();

        // uncomment this if we are not calling update from a game loop
        // window.requestAnimationFrame(handle_gamepad);
    }

    this.fake_keyboard_events = function() {// if any
        // compare previous state
        if (!prev_gamepad_left && gamepad_left) this.simulateKeyDown(SIMULATED_KEY_LEFT);
        if (!prev_gamepad_right && gamepad_right) this.simulateKeyDown(SIMULATED_KEY_RIGHT);
        if (!prev_gamepad_up && gamepad_up) this.simulateKeyDown(SIMULATED_KEY_UP);
        if (!prev_gamepad_down && gamepad_down) this.simulateKeyDown(SIMULATED_KEY_DOWN);
        if (!prev_gamepad_fire && gamepad_b) this.simulateKeyDown(SIMULATED_KEY_B_BUTTON);
        if (!prev_gamepad_jump && gamepad_a) this.simulateKeyDown(SIMULATED_KEY_A_BUTTON);
        if (!prev_gamepad_x && gamepad_x) this.simulateKeyDown(SIMULATED_KEY_X_BUTTON);
        if (!prev_gamepad_y && gamepad_y) this.simulateKeyDown(SIMULATED_KEY_Y_BUTTON);
        // only sends events if state has changed
        if (prev_gamepad_left && !gamepad_left) this.simulateKeyUp(SIMULATED_KEY_LEFT);
        if (prev_gamepad_right && !gamepad_right) this.simulateKeyUp(SIMULATED_KEY_RIGHT);
        if (prev_gamepad_up && !gamepad_up) this.simulateKeyUp(SIMULATED_KEY_UP);
        if (prev_gamepad_down && !gamepad_down) this.simulateKeyUp(SIMULATED_KEY_DOWN);
        if (prev_gamepad_fire && !gamepad_b) this.simulateKeyUp(SIMULATED_KEY_B_BUTTON);
        if (prev_gamepad_jump && !gamepad_a) this.simulateKeyUp(SIMULATED_KEY_A_BUTTON);
        if (prev_gamepad_x && !gamepad_x) this.simulateKeyUp(SIMULATED_KEY_X_BUTTON);
        if (prev_gamepad_y && !gamepad_y) this.simulateKeyUp(SIMULATED_KEY_Y_BUTTON);
        // now remember current state
        prev_gamepad_left = gamepad_left;
        prev_gamepad_right = gamepad_right;
        prev_gamepad_up = gamepad_up;
        prev_gamepad_down = gamepad_down;
        prev_gamepad_fire = gamepad_b;
        prev_gamepad_jump = gamepad_a;
        prev_gamepad_x = gamepad_x;
        prev_gamepad_y = gamepad_y;
    }
    
    this.simulateKeyDown = function(thisKey) {
        var oEvent = document.createEvent('KeyboardEvent');
        Object.defineProperty(oEvent, 'keyCode', { get : function() { return this.keyCodeVal; } });     
        Object.defineProperty(oEvent, 'which', { get : function() { return this.keyCodeVal; } });     
        if (oEvent.initKeyboardEvent) {
            oEvent.initKeyboardEvent("keydown", true, true, document.defaultView, false, false, false, false, thisKey, thisKey);
        } else {
            oEvent.initKeyEvent("keydown", true, true, document.defaultView, false, false, false, false, thisKey, 0);
        }
        oEvent.keyCodeVal = thisKey;
        document.dispatchEvent(oEvent);
    }
    
    this.simulateKeyUp = function(thisKey) {
        var oEvent = document.createEvent('KeyboardEvent');
        Object.defineProperty(oEvent, 'keyCode', { get : function() { return this.keyCodeVal; } });     
        Object.defineProperty(oEvent, 'which', { get : function() { return this.keyCodeVal; } });     
        if (oEvent.initKeyboardEvent) {
            oEvent.initKeyboardEvent("keyup", true, true, document.defaultView, false, false, false, false, thisKey, thisKey);
        } else {
            oEvent.initKeyEvent("keyup", true, true, document.defaultView, false, false, false, false, thisKey, 0);
        }
        oEvent.keyCodeVal = thisKey;
        document.dispatchEvent(oEvent);
    }

    this.update = function() {
        this.handle_gamepad();
    }

} // GamepadManager


