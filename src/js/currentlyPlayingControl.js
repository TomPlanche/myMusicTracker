
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
	constructor(imgSrc, title, artist) {
		this.DOM = {};
		
		let currentlyPlaying = document.createElement("div");
		currentlyPlaying.className = "currently-playing";

		let img = document.createElement("img");
		img.src = imgSrc;
		currentlyPlaying.appendChild(img);
		
		let infos = document.createElement("div");
		infos.className = "infos";
		
		let titleEl = document.createElement("h1");
		titleEl.innerHTML = title;
		
		let artistEl = document.createElement("h2");
		artistEl.innerHTML = artist;
		
		infos.appendChild(titleEl);
		infos.appendChild(artistEl);
		
		currentlyPlaying.appendChild(infos);
		
		this.DOM.el = currentlyPlaying;
	}
	
	addToWindow() {
		document.body.appendChild(this.DOM.el);
	}
	
	removeFromWindow() {
		document.body.removeChild(this.DOM.el);
	}
	
	changeInfos(title, artist, img) {
		this.DOM.el.querySelector("h1").innerHTML = title;
		this.DOM.el.querySelector("h2").innerHTML = artist;
		this.DOM.el.querySelector("img").src = img;
	}
	
	
}
