
import { lerp, getMousePos, calcWinsize, verifyIsInBounds } from "./myUsualFuncs.js";

// Calculate the viewport size
let winsize = calcWinsize();
window.addEventListener('resize', () => winsize = calcWinsize());

// Track the mouse position
let mousepos = {x: 0, y: 0};
window.addEventListener('mousemove', ev => mousepos = getMousePos(ev));


/**
 * Class for the button control.
 * @param el - The button element.
 *
 * The button should have the following structure:
 * <button class="button">
 *     <div class="button__filler"></div>
 *     <span class="button__text">
 * 		  <span class="button__text-inner">Text</span>
 * 	   </span>
 * </button>
 */
export default class ButtonCtrl {
    /**
     * ButtonCtrl constructor.
     * @param el - The button element.
     * @param customCursor - If true, the button will send the button events to the cursor.
     */
    constructor(
            el,
            options = undefined
        ) {
        // DOM elements
        // el: main button
        // text: inner text element
        this.DOM = {el: el};
        this.DOM.filler = this.DOM.el.querySelector('.button__filler');
        this.DOM.text = this.DOM.el.querySelector('.button__text');
        this.DOM.textinner = this.DOM.el.querySelector('.button__text-inner');
        
        let acceptedOptions = {
            customCursor: undefined,
            distanceNeededToTrigger: 1.2,
            distanceToLeave: .5
        }
        /**
         * Accepted options:
         *
         * - customCursor: if not undefined, the button will send the button events to the cursor.
         * - distanceNeededToTrigger: the movement will take place when the distance from the mouse to the center of the button is lower than this value.
         */
        if (options !== undefined) {
            for (const [key, value] of Object.entries(options)) {
                if (key in acceptedOptions) {
                    acceptedOptions[key] = value;
                }
            }
        }
        
        this.acceptedOptions = acceptedOptions;
        
				// amounts the button will translate
        this.renderedStyles = {
            tx: {previous: 0, current: 0, amt: 0.1},
            ty: {previous: 0, current: 0, amt: 0.1},
        };

				// button state (hover)
        this.state = {
            hover: false
        };

				// calculate size/position
        this.calculateSizePosition();

				// init events
        this.initEvents();

				// loop function needed for smooth animation
        requestAnimationFrame(() => this.render());
    }
    
    /**
     * Calculate self position and size.
     */
    calculateSizePosition() {
        // size/position
        this.rect = this.DOM.el.getBoundingClientRect();
    }
    
    /**
     * Initialize the events.
     */
    initEvents() {
        this.onResize = () => this.calculateSizePosition();
        window.addEventListener('resize', this.onResize);
    }
    
    /**
     * Runs a function when the button is clicked.
     * @param func - The function to run.
     */
    onClick(func) {
        this.DOM.el.addEventListener('click', func);
    }
    
    /**
     * Render function.
     */
    render() {
        const distanceToTriggerFromBounds =
            this.acceptedOptions.distanceNeededToTrigger < 1 ? 1 + this.acceptedOptions.distanceNeededToTrigger : this.acceptedOptions.distanceNeededToTrigger;
        
        
        // new values for the translations
        let x = 0;
        let y = 0;

        if (verifyIsInBounds(mousepos, this.rect, distanceToTriggerFromBounds)) {
            if ( !this.state.hover ) {
                this.enter();
            }
            x = (mousepos.x + window.scrollX - (this.rect.left + this.rect.width / 2)) * this.acceptedOptions.distanceToLeave;
            y = (mousepos.y + window.scrollY - (this.rect.top + this.rect.height / 2)) * this.acceptedOptions.distanceToLeave;
        }
        else if ( verifyIsInBounds(mousepos, this.rect, this.acceptedOptions.distanceToLeave) ) {
            this.leave();
        }

        this.renderedStyles['tx'].current = x;
        this.renderedStyles['ty'].current = y;

        for (const key in this.renderedStyles ) {
            this.renderedStyles[key].previous = lerp(this.renderedStyles[key].previous, this.renderedStyles[key].current, this.renderedStyles[key].amt);
        }

        this.DOM.el.style.transform = `translate3d(${this.renderedStyles['tx'].previous}px, ${this.renderedStyles['ty'].previous}px, 0)`;
        this.DOM.text.style.transform = `translate3d(${-this.renderedStyles['tx'].previous*0.6}px, ${-this.renderedStyles['ty'].previous*0.6}px, 0)`;

        requestAnimationFrame(() => this.render());
    }
    
    /**
     * When the mouse enters the button.
     */
    enter() {
        this.state.hover = true;
        this.DOM.el.classList.add('button--hover');
        this.acceptedOptions.customCursor.enter();
        
        document.body.classList.add('active');
        
        gsap.killTweensOf(this.DOM.filler);
        gsap.killTweensOf(this.DOM.textinner);

        gsap.timeline().to(this.DOM.filler, 0.5, {
            ease: 'Power3.easeOut',
            startAt: {y: '75%'},
            y: '0%'
        }).to(this.DOM.textinner, 0.1, {
            ease: 'Power3.easeOut',
            opacity: 0,
            y: '-10%'
        }, 0).to(this.DOM.textinner, 0.25, {
            ease: 'Power3.easeOut',
            opacity: 1,
            startAt: {y: '30%', opacity: 1},
            y: '0%'
        }, 0.1);
    }
    
    /**
     * When the mouse leaves the button.
     */
    leave() {
        this.state.hover = false;
        this.DOM.el.classList.remove('button--hover');
        document.body.classList.remove('active');
        
        this.acceptedOptions.customCursor.leave();
        

        gsap.killTweensOf(this.DOM.filler);
        gsap.killTweensOf(this.DOM.textinner);

        gsap.timeline().to(this.DOM.filler, 0.4, {
            ease: 'Power3.easeOut',
            y: '-75%'
        }).to(this.DOM.textinner, 0.1, {
            ease: 'Power3.easeOut',
            opacity: 0,
            y: '10%'
        }, 0).to(this.DOM.textinner, 0.25, {
            ease: 'Power3.easeOut',
            opacity: 1,
            startAt: {y: '-30%', opacity: 1},
            y: '0%'
        }, 0.1);
    }
}
