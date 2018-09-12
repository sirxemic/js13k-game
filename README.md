# Offline Paradise - A js13kGames submission

This is a simple platformer created for the [js13kGames competition of 2018](https://2018.js13kgames.com/). The theme was "offline".

## About the code

If you want to modify the code, just start by running

```
npm install && npm start
```

## Creating levels

There is also a level editor! To make your own levels, just run

```
npm run editor
```

How to use it is far from trivial, so here is a little manual:

- Left click to draw or edit the properties of objects
- Right click to erase
- Use the number keys 1 until 8 to change what thing to draw or edit
- Press space to play the level
- Press Ctrl-C to copy the level's JSON to the clipboard
- To save the level, add the copied JSON to `assets/levels.json`
- To load a level, press 0 and then the index of the level in `assets/levels.json`
