export let TheCanvas = document.querySelector('canvas')
export let TheGraphics = TheCanvas.getContext('2d')

// Closure Compiler would rename the property if we don't set it like this
TheGraphics['imageSmoothingEnabled'] = false
