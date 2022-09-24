
import { lerp, getMousePos } from "./myUsualFuncs.js";

// Track the mouse position
let mouse = {x: 0, y: 0};
window.addEventListener('mousemove', ev => mouse = getMousePos(ev));

/**
 * Custom cursor class
 * The cursor should have the following structure:
 * 
 * <svg class="cursor" width="25" height="25" viewBox="0 0 25 25">
 *     <circle class="cursor__inner" cx="12.5" cy="12.5" r="6.25"/>
 * </svg>
 */
export default class CustomCursor {
    /**
     * CustomCursor constructor.
     * @param el - The cursor element.
     */
    constructor(el) {
        this.DOM = {el: el};
        this.DOM.el.style.opacity = "0";
        
        this.bounds = this.DOM.el.getBoundingClientRect();
        
        this.renderedStyles = {
            tx: {previous: 0, current: 0, amt: 0.2},
            ty: {previous: 0, current: 0, amt: 0.2},
            scale: {previous: 1, current: 1, amt: 0.2},
            opacity: {previous: 1, current: 1, amt: 0.2}
        };

        this.onMouseMoveEv = () => {
            this.renderedStyles.tx.previous = this.renderedStyles.tx.current = mouse.x - this.bounds.width / 2;
            this.renderedStyles.ty.previous = this.renderedStyles.ty.previous = mouse.y - this.bounds.height / 2;
            gsap.to(this.DOM.el, {duration: 0.9, ease: 'Power3.easeOut', opacity: 1});
            requestAnimationFrame(() => this.render());
            window.removeEventListener('mousemove', this.onMouseMoveEv);
        };
        window.addEventListener('mousemove', this.onMouseMoveEv);
    }
    
    /**
     * When the cursor enters a specified element.
     */
    enter() {
        this.renderedStyles['scale'].current = 4;
        this.renderedStyles['opacity'].current = 0.6;
        this.DOM.el.children[0].style.fill = "#111";
        this.DOM.el.children[0].style.stroke = "#111";
    }
    
    /**
     * When the cursor leaves a specified element.
     */
    leave() {
        this.renderedStyles['scale'].current = 1;
        this.renderedStyles['opacity'].current = 1;
        this.DOM.el.children[0].style.stroke = "#eee";
        this.DOM.el.children[0].style.fill = "#eee";
    }
    
    /**
     * Render the cursor.
     */
    render() {
        this.renderedStyles['tx'].current = mouse.x - this.bounds.width / 2;
        this.renderedStyles['ty'].current = mouse.y - this.bounds.height / 2;

        for (const key in this.renderedStyles ) {
            this.renderedStyles[key].previous = lerp(this.renderedStyles[key].previous, this.renderedStyles[key].current, this.renderedStyles[key].amt);
        }
        
        this.DOM.el.style.transform = `translateX(${(this.renderedStyles['tx'].previous)}px) translateY(${this.renderedStyles['ty'].previous}px) scale(${this.renderedStyles['scale'].previous})`;
        this.DOM.el.style.opacity = this.renderedStyles['opacity'].previous;

        requestAnimationFrame(() => this.render());
    }
}
