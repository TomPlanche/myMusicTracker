// =============================================================================
//                             MADE BY TOM PLANCHE
//                            tomplanche@icloud.com
//                            github.com/tomPlanche
// =============================================================================

/**
 * Linear interpolation - need brubru to explain.
 */
const lerp = (a, b, n) => (1 - n) * a + n * b;


/**
 * Calculate the window size.
 * @returns {{width: number, height: number}}
 */
const calcWinsize = () => {
    return {width: window.innerWidth, height: window.innerHeight};
};

/**
 * Get the mouse position.
 * @param e
 * @returns {{x: number, y: number}}
 */
const getMousePos = e => {
    return {
        x : e.clientX,
        y : e.clientY
    };
};


/**
 * Calculate the distance between two points.
 * @param x1 - x position of the first point.
 * @param y1 - y position of the first point.
 * @param x2 - x position of the second point.
 * @param y2 - y position of the second point.
 * @returns {number} - The distance between the two points.
 */
const distance = (x1,y1,x2,y2) => {
    const a = x1 - x2;
    const b = y1 - y2;

    return Math.hypot(a,b);
}

/**
 * Generate a random float.
 * @param min - The minimum value.
 * @param max - The maximum value.
 * @returns {string} - The random float.
 */
const getRandomFloat = (min, max) => (Math.random() * (max - min) + min).toFixed(2);

const verifyIsInBounds = (
    mousepos,
    rect,
    boundsExtention = 1
) => {
    return mousepos.x >= rect.left / boundsExtention &&
        mousepos.x <= rect.right * boundsExtention &&
        mousepos.y >= rect.top / boundsExtention &&
        mousepos.y <= rect.bottom * boundsExtention;
    }

export {
    calcWinsize,
    distance,
    getMousePos,
    getRandomFloat,
    lerp,
    verifyIsInBounds
};
