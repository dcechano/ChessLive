class Clock {
    constructor(timeControl, domDisplay) {
        let arr = timeControl.split('_');
        this.inc = +arr.pop();
        switch (arr[0]) {
            case 'TWO':
                this.seconds = 2*60;
                break;
            case 'FIVE':
                this.seconds = 5*60;
                break;
            case 'TEN':
                this.seconds = 10*60;
                break;
        }
        this.on = false;
        this.display = domDisplay;
    }

    run() {
        if (this.on) {
            this.seconds--;
            this.updateDisplay();
        }
    }

    stop() {
        this.on = false;
    }

    pause() {
        this.on = false;
        this.seconds += this.inc;
        this.updateDisplay();
    }

    resume() {
        this.on = true;
    }

    updateDisplay() {
        if (this.seconds === 0) {
            this.display.style.color = 'red';
            this.display.textContent = '00:00';
            this.on = false;
            return;
        }
        let mins = Math.floor(this.seconds / 60);
        let seconds = this.seconds % 60;
        this.display.textContent = `${mins}:${(seconds < 10) ? ('0' + seconds): seconds}`;
    }
}

module.exports = Clock;