
import { lerp, getMousePos, calcWinsize, distance } from "./myFuncs.js";

// Calculate the viewport size
let winsize = calcWinsize();
window.addEventListener('resize', () => winsize = calcWinsize());

// Track the mouse position
let mousepos = {x: 0, y: 0};
window.addEventListener('mousemove', ev => mousepos = getMousePos(ev));


/**
 * Class for the currently playing element
 * Here's the wanted html structure:
 *
 * <div className="currently-playing">
 *     <img src="https://lastfm.freetls.fastly.net/i/u/300x300/0fa39163964da76f9f77f38d5ae7b61b.jpg" alt="">
 *     <div className="infos">
 *         <h1>Titre</h1>
 *         <h2>Artiste</h2>
 *     </div>
 * </div>
 */
export default class CurrentlyPlaying {
	constructor(imgSrc, title, artist, url) {
		this.DOM = {};
		
		this.imgSrc = imgSrc;
		this.title = title;
		this.artist = artist;
		this.url = url;
		
		// button state (hover)
    this.state = {
			displayed: false,
      hover: false
    };
		
		// init events
    this.init();
		
		// calculate size/position
    this.calculateSizePosition();
		
		// loop function needed for smooth animation
    requestAnimationFrame(() => this.render());
		
	}
	
	init() {
		let currentlyPlaying = document.createElement("div");
		currentlyPlaying.className = "currently-playing";

		let img = document.createElement("img");
		img.src = this.imgSrc;
		
		currentlyPlaying.appendChild(img);
		
		let infos = document.createElement("div");
		infos.className = "infos";
		
		let titleEl = document.createElement("h1");
		titleEl.innerHTML = this.title;
		
		let artistEl = document.createElement("h2");
		artistEl.innerHTML = this.artist;
		
		infos.appendChild(titleEl);
		infos.appendChild(artistEl);
		
		currentlyPlaying.appendChild(infos);
		
		this.DOM.el = currentlyPlaying;
		
    this.onResize = () => this.calculateSizePosition();
    window.addEventListener('resize', this.onResize);
	}
	
	render() {
		if (this.state.displayed) {
			// check if the mouse is in the element bounds
	    const mouseInButton =
			    mousepos.x + window.scrollX >= this.rect.left &&
			    mousepos.x + window.scrollX <= this.rect.left + this.rect.width &&
			    mousepos.y + window.scrollY >= this.rect.top &&
			    mousepos.y + window.scrollY <= this.rect.top + this.rect.height;
			
			// update the state
			if (mouseInButton && !this.state.hover) {
				this.state.hover = true;
				this.hover();
			} else if (!mouseInButton && this.state.hover) {
				this.state.hover = false;
				this.leave();
			}
		}
		requestAnimationFrame(() => this.render());
	}
	
	/**
   * Calculate self position and size.
   */
  calculateSizePosition() {
		if (this.state.displayed) {
		  // size/position
		  this.rect = this.DOM.el.getBoundingClientRect();
		}
  }
	
	display() {
		document.querySelector("main").appendChild(this.DOM.el);
		this.DOM.el = document.querySelector(".currently-playing");
		
		this.state.displayed = true;
		
		this.DOM.el.addEventListener('click', () => {
			window.open(this.url, "_blank");
		})
		
		this.calculateSizePosition();
	}
	
	remove() {
		document.body.removeChild(this.DOM.el);
	}
	
	update(img, title, artist, url) {
		this.DOM.el.querySelector("h1").innerHTML = title;
		this.DOM.el.querySelector("h2").innerHTML = artist;
		this.DOM.el.querySelector("img").src = img;
		this.url = url;
	}
	
	hover() {
		gsap.killTweensOf(this.DOM.el);
		gsap.to(this.DOM.el, {
			duration: 0.5,
			ease: "power3.out",
			width: `${this.rect.width * 1.2}px`,
			height: `${this.rect.height * 1.2}px`,
			onComplete: () => {
				this.calculateSizePosition();
			}
		});
	}
	
	leave() {
		gsap.killTweensOf(this.DOM.el);
		gsap.to(this.DOM.el, {
			duration: 0.5,
			ease: "power3.out",
			width: `${this.rect.width / 1.2}px`,
			height: `${this.rect.height / 1.2}px`,
			onComplete: () => {
				this.calculateSizePosition();
			}
		});
	}
}
