// =============================================================================
//                             MADE BY TOM PLANCHE                              
//                            tomplanche@icloud.com
//                            github.com/tomPlanche
// =============================================================================

// Personal functions imports
import {
	lerp,
  calcWinsize,
  getMousePos,
  distance,
  getRandomFloat
} from "./js/myFuncs.js";

import { LAST_FM_API_KEY, LAST_FM_API_SECRET, XHR_AUTH } from "./js/secrets.js";

import ButtonCtrl from "./js/buttonControl.js";
import customCursor from "./js/customCursor.js";
import CurrentlyPlaying from "./js/currentlyPlayingControl.js";

gsap.registerPlugin(
	ScrambleTextPlugin,
	ScrollSmoother,
  ScrollToPlugin,
	ScrollTrigger,
  SplitText
)

// -------------------------------- VARIABLES ----------------------------------
let title = "Tom Planche's Music Tracker ";
let changeTitleInterval;

let mouse = {x: 0, y: 0};

const emojiColor = "#7EC8E3";

const normalEmojiSvg = `<svg id="topLeftEmoji" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M7.77222 5.98169H6.25218C6.1026 5.98169 5.98145 6.10284 5.98145 6.25242V7.77246C5.98145 7.92204 6.1026 8.0432 6.25218 8.0432H7.77222C7.9218 8.0432 8.04295 7.92204 8.04295 7.77246V6.25242C8.04295 6.10284 7.9218 5.98169 7.77222 5.98169Z" fill="${emojiColor}"/><path d="M15.7478 5.98169H14.2278C14.0782 5.98169 13.957 6.10284 13.957 6.25242V7.77246C13.957 7.92204 14.0782 8.0432 14.2278 8.0432H15.7478C15.8974 8.0432 16.0185 7.92204 16.0185 7.77246V6.25242C16.0185 6.10284 15.8974 5.98169 15.7478 5.98169Z" fill="${emojiColor}"/><path d="M21.7294 5.9816H20.277C20.1275 5.9816 20.0063 5.86045 20.0063 5.71087V4.25851C20.0063 4.10893 19.8852 3.98778 19.7356 3.98778H18.2832C18.1336 3.98778 18.0125 3.86663 18.0125 3.71705V2.26456C18.0125 2.11498 17.8913 1.99382 17.7418 1.99382H16.2894C16.1398 1.99382 16.0187 1.87267 16.0187 1.72309V0.270734C16.0187 0.121154 15.8975 0 15.7479 0H6.25234C6.10276 0 5.9816 0.121154 5.9816 0.270734V1.72309C5.9816 1.87267 5.86045 1.99382 5.71087 1.99382H4.25851C4.10893 1.99382 3.98778 2.11498 3.98778 2.26456V3.71691C3.98778 3.86649 3.86663 3.98764 3.71705 3.98764H2.26456C2.11498 3.98764 1.99382 4.1088 1.99382 4.25838V5.71073C1.99382 5.86031 1.87267 5.98147 1.72309 5.98147H0.270734C0.121154 5.98147 0 6.10262 0 6.2522V15.7477C0 15.8972 0.121154 16.0184 0.270734 16.0184H1.72309C1.87267 16.0184 1.99382 16.1396 1.99382 16.2891V17.7415C1.99382 17.8911 2.11498 18.0122 2.26456 18.0122H3.71691C3.86649 18.0122 3.98764 18.1334 3.98764 18.283V19.7353C3.98764 19.8849 4.1088 20.006 4.25838 20.006H5.71073C5.86031 20.006 5.98147 20.1272 5.98147 20.2768V21.7291C5.98147 21.8787 6.10262 21.9999 6.2522 21.9999H15.7478C15.8974 21.9999 16.0185 21.8787 16.0185 21.7291V20.2768C16.0185 20.1272 16.1397 20.006 16.2893 20.006H17.7416C17.8912 20.006 18.0124 19.8849 18.0124 19.7353V18.283C18.0124 18.1334 18.1335 18.0122 18.2831 18.0122H19.7354C19.885 18.0122 20.0062 17.8911 20.0062 17.7415V16.2891C20.0062 16.1396 20.1273 16.0184 20.2769 16.0184H21.7293C21.8788 16.0184 22 15.8972 22 15.7477V6.25234C22.0001 6.10276 21.879 5.9816 21.7294 5.9816ZM17.6741 17.9448H16.2217C16.0721 17.9448 15.951 18.066 15.951 18.2155V19.6679C15.951 19.8175 15.8298 19.9386 15.6803 19.9386H6.32002C6.17044 19.9386 6.04929 19.8175 6.04929 19.6679V18.2155C6.04929 18.066 5.92813 17.9448 5.77855 17.9448H4.3262C4.17662 17.9448 4.05546 17.8237 4.05546 17.6741V16.2217C4.05546 16.0721 3.93431 15.951 3.78473 15.951H2.33224C2.18266 15.951 2.06151 15.8298 2.06151 15.6803V6.32002C2.06151 6.17044 2.18266 6.04929 2.33224 6.04929H3.78459C3.93417 6.04929 4.05533 5.92813 4.05533 5.77855V4.3262C4.05533 4.17662 4.17648 4.05546 4.32606 4.05546H5.77842C5.928 4.05546 6.04915 3.93431 6.04915 3.78473V2.33224C6.04915 2.18266 6.1703 2.06151 6.31988 2.06151H15.6801C15.8297 2.06151 15.9508 2.18266 15.9508 2.33224V3.78459C15.9508 3.93417 16.072 4.05533 16.2216 4.05533H17.6739C17.8235 4.05533 17.9447 4.17648 17.9447 4.32606V5.77842C17.9447 5.928 18.0658 6.04915 18.2154 6.04915H19.6678C19.8173 6.04915 19.9385 6.1703 19.9385 6.31988V15.68C19.9385 15.8296 19.8173 15.9507 19.6678 15.9507H18.2154C18.0658 15.9507 17.9447 16.0719 17.9447 16.2214V17.6738C17.9448 17.8235 17.8235 17.9448 17.6741 17.9448Z" fill="${emojiColor}"/><path d="M3.98779 10.2402V13.7542C3.98779 13.9038 4.10895 14.0249 4.25853 14.0249H5.71088C5.86046 14.0249 5.98162 14.1461 5.98162 14.2957V15.748C5.98162 15.8976 6.10277 16.0188 6.25235 16.0188H7.7047C7.85428 16.0188 7.97544 16.1399 7.97544 16.2895V17.7419C7.97544 17.8914 8.09659 18.0126 8.24617 18.0126H13.754C13.9036 18.0126 14.0247 17.8914 14.0247 17.7419V16.2895C14.0247 16.1399 14.1459 16.0188 14.2955 16.0188H15.7478C15.8974 16.0188 16.0185 15.8976 16.0185 15.748V14.2957C16.0185 14.1461 16.1397 14.0249 16.2893 14.0249H17.7416C17.8912 14.0249 18.0124 13.9038 18.0124 13.7542V10.2402C18.0124 10.0906 17.8912 9.96948 17.7416 9.96948H4.25853C4.10895 9.96948 3.98779 10.0906 3.98779 10.2402ZM15.6801 13.9571H14.2278C14.0782 13.9571 13.957 14.0783 13.957 14.2279V15.6802C13.957 15.8298 13.8359 15.9509 13.6863 15.9509H8.31386C8.16427 15.9509 8.04312 15.8298 8.04312 15.6802V14.2279C8.04312 14.0783 7.92197 13.9571 7.77239 13.9571H6.32003C6.17045 13.9571 6.0493 13.836 6.0493 13.6864V12.3017C6.0493 12.1521 6.17045 12.031 6.32003 12.031H15.6803C15.8298 12.031 15.951 12.1521 15.951 12.3017V13.6864C15.9509 13.836 15.8297 13.9571 15.6801 13.9571Z" fill="${emojiColor}"/></svg>`;
const blinkingEmojiSvg = `<svg id="topLeftEmoji" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M7.77222 5.98169H6.25218C6.1026 5.98169 5.98145 6.10284 5.98145 6.25242V7.77246C5.98145 7.92204 6.1026 8.0432 6.25218 8.0432H7.77222C7.9218 8.0432 8.04295 7.92204 8.04295 7.77246V6.25242C8.04295 6.10284 7.9218 5.98169 7.77222 5.98169Z" fill="${emojiColor}"/><path d="M15.7478 5.98169H12.1662C12.0167 5.98169 11.8955 6.10284 11.8955 6.25242V7.77246C11.8955 7.92204 12.0167 8.0432 12.1662 8.0432H15.7479C15.8975 8.0432 16.0187 7.92204 16.0187 7.77246V6.25242C16.0185 6.10284 15.8974 5.98169 15.7478 5.98169Z" fill="${emojiColor}"/><path d="M21.7294 5.9816H20.277C20.1275 5.9816 20.0063 5.86045 20.0063 5.71087V4.25851C20.0063 4.10893 19.8852 3.98778 19.7356 3.98778H18.2832C18.1336 3.98778 18.0125 3.86663 18.0125 3.71705V2.26456C18.0125 2.11498 17.8913 1.99382 17.7418 1.99382H16.2894C16.1398 1.99382 16.0187 1.87267 16.0187 1.72309V0.270734C16.0187 0.121154 15.8975 0 15.7479 0H6.25234C6.10276 0 5.9816 0.121154 5.9816 0.270734V1.72309C5.9816 1.87267 5.86045 1.99382 5.71087 1.99382H4.25851C4.10893 1.99382 3.98778 2.11498 3.98778 2.26456V3.71691C3.98778 3.86649 3.86663 3.98764 3.71705 3.98764H2.26456C2.11498 3.98764 1.99382 4.1088 1.99382 4.25838V5.71073C1.99382 5.86031 1.87267 5.98147 1.72309 5.98147H0.270734C0.121154 5.98147 0 6.10262 0 6.2522V15.7477C0 15.8972 0.121154 16.0184 0.270734 16.0184H1.72309C1.87267 16.0184 1.99382 16.1396 1.99382 16.2891V17.7415C1.99382 17.8911 2.11498 18.0122 2.26456 18.0122H3.71691C3.86649 18.0122 3.98764 18.1334 3.98764 18.283V19.7353C3.98764 19.8849 4.1088 20.006 4.25838 20.006H5.71073C5.86031 20.006 5.98147 20.1272 5.98147 20.2768V21.7291C5.98147 21.8787 6.10262 21.9999 6.2522 21.9999H15.7478C15.8974 21.9999 16.0185 21.8787 16.0185 21.7291V20.2768C16.0185 20.1272 16.1397 20.006 16.2893 20.006H17.7416C17.8912 20.006 18.0124 19.8849 18.0124 19.7353V18.283C18.0124 18.1334 18.1335 18.0122 18.2831 18.0122H19.7354C19.885 18.0122 20.0062 17.8911 20.0062 17.7415V16.2891C20.0062 16.1396 20.1273 16.0184 20.2769 16.0184H21.7293C21.8788 16.0184 22 15.8972 22 15.7477V6.25234C22.0001 6.10276 21.879 5.9816 21.7294 5.9816ZM17.6741 17.9448H16.2217C16.0721 17.9448 15.951 18.066 15.951 18.2155V19.6679C15.951 19.8175 15.8298 19.9386 15.6803 19.9386H6.32002C6.17044 19.9386 6.04929 19.8175 6.04929 19.6679V18.2155C6.04929 18.066 5.92813 17.9448 5.77855 17.9448H4.3262C4.17662 17.9448 4.05546 17.8237 4.05546 17.6741V16.2217C4.05546 16.0721 3.93431 15.951 3.78473 15.951H2.33224C2.18266 15.951 2.06151 15.8298 2.06151 15.6803V6.32002C2.06151 6.17044 2.18266 6.04929 2.33224 6.04929H3.78459C3.93417 6.04929 4.05533 5.92813 4.05533 5.77855V4.3262C4.05533 4.17662 4.17648 4.05546 4.32606 4.05546H5.77842C5.928 4.05546 6.04915 3.93431 6.04915 3.78473V2.33224C6.04915 2.18266 6.1703 2.06151 6.31988 2.06151H15.6801C15.8297 2.06151 15.9508 2.18266 15.9508 2.33224V3.78459C15.9508 3.93417 16.072 4.05533 16.2216 4.05533H17.6739C17.8235 4.05533 17.9447 4.17648 17.9447 4.32606V5.77842C17.9447 5.928 18.0658 6.04915 18.2154 6.04915H19.6678C19.8173 6.04915 19.9385 6.1703 19.9385 6.31988V15.68C19.9385 15.8296 19.8173 15.9507 19.6678 15.9507H18.2154C18.0658 15.9507 17.9447 16.0719 17.9447 16.2214V17.6738C17.9448 17.8235 17.8235 17.9448 17.6741 17.9448Z" fill="${emojiColor}"/><path d="M3.98779 10.2402V13.7542C3.98779 13.9038 4.10895 14.0249 4.25853 14.0249H5.71088C5.86046 14.0249 5.98162 14.1461 5.98162 14.2957V15.748C5.98162 15.8976 6.10277 16.0188 6.25235 16.0188H7.7047C7.85428 16.0188 7.97544 16.1399 7.97544 16.2895V17.7419C7.97544 17.8914 8.09659 18.0126 8.24617 18.0126H13.754C13.9036 18.0126 14.0247 17.8914 14.0247 17.7419V16.2895C14.0247 16.1399 14.1459 16.0188 14.2955 16.0188H15.7478C15.8974 16.0188 16.0185 15.8976 16.0185 15.748V14.2957C16.0185 14.1461 16.1397 14.0249 16.2893 14.0249H17.7416C17.8912 14.0249 18.0124 13.9038 18.0124 13.7542V10.2402C18.0124 10.0906 17.8912 9.96948 17.7416 9.96948H4.25853C4.10895 9.96948 3.98779 10.0906 3.98779 10.2402ZM15.6801 13.9571H14.2278C14.0782 13.9571 13.957 14.0783 13.957 14.2279V15.6802C13.957 15.8298 13.8359 15.9509 13.6863 15.9509H8.31386C8.16427 15.9509 8.04312 15.8298 8.04312 15.6802V14.2279C8.04312 14.0783 7.92197 13.9571 7.77239 13.9571H6.32003C6.17045 13.9571 6.0493 13.836 6.0493 13.6864V12.3017C6.0493 12.1521 6.17045 12.031 6.32003 12.031H15.6803C15.8298 12.031 15.951 12.1521 15.951 12.3017V13.6864C15.9509 13.836 15.8297 13.9571 15.6801 13.9571Z" fill="${emojiColor}"/></svg>`;

const topLeftEmoji = document.querySelector("#topLeftEmoji");

let lastPlayed = undefined;
let currentlyPlayingPlayer = undefined;

const cursor = new customCursor(document.querySelector('.cursor'));
const buttonMenu = new ButtonCtrl(
		document.querySelector('#seeAccountButton'),
		{
			customCursor: cursor,
			distanceNeededToTrigger: 1
		}
);
// ------------------------------ END VARIABLES --------------------------------


// ------------------------------ LAST FM API ------------------------------
// Create a cache object
let cache = new LastFMCache();

// Create a LastFM object
let lastfm = new LastFM({
  apiKey    : LAST_FM_API_KEY,
  apiSecret : LAST_FM_API_SECRET,
  cache     : cache
});
// ------------------------------ LAST FM API ------------------------------

// -------------------------------- FUNCTIONS ----------------------------------
/**
 * Change the page title coupled with a setTimeout
 */
const changeTitle = () => {
	if (title.substring(1)[0] === " ") { title = title.substring(1) + title.substring(0, 1) };
	title = title.substring(1) + title.substring(0, 1);
	document.title = title;
}

/**
 * fetch the data from the API.
 */
const fetch_user_data = () => {
	console.log("fetching data...");
	lastfm.user.getRecentTracks(
		{
			user: 'Tom_planche'
		},
		{
			success: function(data) {
				// Use data
				console.log("data fetched");
				handleUserData(data)
			},
			error: function(code, message){
	      // Handle error
				console.log(message);
			}
		}
	);
	
	lastfm.user.getInfo(
		{
			user: 'Tom_planche'
		},
			{
			success: function(userData) {
				// Use data
				console.log(userData);
				handleUserInfo(userData)
			},
			error: function(code, message) {
					      // Handle error
				console.log(message);
			}
		}
	);
}


const handleUserData = (data) => {
	const scrobbleList = data.recenttracks.track;
	lastPlayed = scrobbleList[0];
	
	if (lastPlayed["@attr"] !== undefined && lastPlayed["@attr"].nowplaying === "true") {
		const artist = lastPlayed.artist["#text"];
		const track = lastPlayed.name;
		const album = lastPlayed.album["#text"];
		const image = lastPlayed.image[3]["#text"];
		const url = lastPlayed.url;
		
		if (currentlyPlayingPlayer === undefined) {
			currentlyPlayingPlayer = new CurrentlyPlaying(image, track, artist, url);
			currentlyPlayingPlayer.display();
		} else {
			currentlyPlayingPlayer.update(image, track, artist, url);
		}
	} else {
		if (currentlyPlayingPlayer !== undefined) {
			currentlyPlayingPlayer.remove();
		}
	}
}


const handleUserInfo = (userData) => {
	const name = userData.user.name;
	const pp_url = userData.user.image[userData.user.image.length - 2]["#text"];
	const scrobbles = userData.user.playcount;
	const url = userData.user.url;
	
	document.querySelector("#imgUser").textContent = pp_url;
	document.querySelector("#accountName").textContent = name;
	document.querySelector("#scrobbleNb").textContent = scrobbles;
	
	buttonMenu.onClick(() => {
		window.open(url, "_blank");
	});
}


const setBackgroundLikeCurrentSongCover = async (imageUrl) => {
	const url = `https://api.imagga.com/v2/colors?image_url=${imageUrl}`;

	let xhr = new XMLHttpRequest();
	xhr.open("GET", url);
	xhr.setRequestHeader("Authorization", XHR_AUTH);
	
	let color_data = await new Promise((resolve, reject) => {
		xhr.onreadystatechange = function() {
			if (xhr.readyState === 4) {
				if (xhr.status === 200) {
					resolve(JSON.parse(xhr.responseText));
				} else {
					reject(xhr.status);
				}
			}
		}
		xhr.send();
	});
	
	const background_colors = color_data.result.colors.background_colors.map(color => color.html_code);
	
	// Change the background color of the body to a gradient of the colors in background_colors
	const background_color_gradient = `linear-gradient(45deg, ${background_colors.join(", ")}`;
	document.querySelector("body").style.background = background_color_gradient;
}
// ------------------------------ END FUNCTIONS --------------------------------


// --------------------------------- SETUP -------------------------------------
// Set the interval (4 times a second) for the title change
changeTitleInterval = setInterval(changeTitle, 250);

// Change the title to 'Come back!" when the user changes the tab
document.addEventListener('visibilitychange', () => {
	if (document.hidden) {
	  clearInterval(changeTitleInterval);
		document.title = "Come back!";
	} else {
	  changeTitleInterval = setInterval(changeTitle, 250);
	}
});

// Get the mouse position
document.addEventListener("mousemove", (e) => {
	mouse = getMousePos(e)
});

// When the mouse enters over the topLeftEmoji, change the normal emoji to the blinking emoji
topLeftEmoji.addEventListener("mouseenter", () => {
	topLeftEmoji.innerHTML = blinkingEmojiSvg;
});

// When the mouse leaves the topLeftEmoji, change the blinking emoji to the normal emoji
topLeftEmoji.addEventListener("mouseleave", () => {
	topLeftEmoji.innerHTML = normalEmojiSvg;
});
// ------------------------------- END SETUP -----------------------------------


// ---------------------------------- CODE -------------------------------------
// setInterval(fetch_user_data, 15_000);
fetch_user_data();
// -------------------------------- END CODE -----------------------------------


// =============================================================================
//                                END OF MAIN.JS
// =============================================================================
