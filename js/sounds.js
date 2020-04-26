const { Howl } = require('howler');


const fireSound = new Howl({
    src: ["assets/sounds/shockwave_whoosh_into_metal_06.mp3", "assets/sounds/shockwave_whoosh_into_metal_06.ogg"],
    onload() {

    },
    volume: 0.3, 
    onloaderror(e, msg) {
        console.log("Error", e, msg)
    }
})


const missSound = new Howl({
    src: ["assets/sounds/water_splash_1.mp3", "assets/sounds/water_splash_1.ogg"],
    onload() {

    },
    volume: 0.5, 
    onloaderror(e, msg) {
        console.log("Error", e, msg)
    }
})


const successSound = new Howl({
    src: ["assets/sounds/clapping.mp3", "assets/sounds/clapping.ogg"],
    onload() {

    },
    volume: 0.3, 
    onloaderror(e, msg) {
        console.log("Error", e, msg)
    }
})


const wrongAreaSound = new Howl({
    src: ["assets/sounds/bounce.mp3", "assets/sounds/bounce.ogg"],
    onload() {

    },
    volume: 0.5, 
    onloaderror(e, msg) {
        console.log("Error", e, msg)
    }
})


module.exports = { fireSound, missSound, successSound, wrongAreaSound }
