# Screens Architecture

This directory contains the individual screens of the **Little Big Feelings** game. The application follows a modular "Template-Init" pattern to handle multi-screen navigation within a Single Page Application (SPA) container.

## How it Works

Each file in this directory is a self-contained ES module that exports two primary functions:

1.  `template()`: Returns a string of HTML representing the screen's layout.
2.  `init({ ...deps })`: Wires up event listeners and performs one-time initialization. It accepts a dependency object (usually containing the `navigate` function).

Some modules also export:
- `onShow()`: A hook called by `main.js` every time the screen is successfully navigated to.
- `populate(data)`: Used by results screens (like `Victory.js`) to inject dynamic data before display.

## Screen Registry

| File | Purpose | Key in `SCREEN_MAP` |
| :--- | :--- | :--- |
| `Splash.js` | The title screen and entry point. | `splash` |
| `NameEntry.js` | User onboarding / profile creation. | `nameEntry` |
| `EmotionSelect.js` | Theme selection (Anger, Sadness, etc.). | `emotionSelect` |
| `LevelSelect.js` | Difficulty selection. | `levelSelect` |
| `Tutorial.js` | Visual instructions on how to play. | `tutorial` |
| `Game.js` | The core card-matching engine. | `game` |
| `Settings.js` | Profile management and volume toggle. | `settings` |
| `Victory.js` | Results summary and encouragement. | `victory` |
| `BreathingBuddy.js` | Calming interactive overlay. | N/A (Self-managing) |
| `OverlayMatch.js` | Success feedback during gameplay. | N/A (Layered) |

## Adding a New Screen

1.  Create `NewScreen.js` in this directory.
2.  Implement `template()` and `init()`.
3.  Import it in `main.js`.
4.  Add its template to the `#app` injection loop in `main.js`.
5.  Add it to the `SCREEN_MAP` registry.
6.  Call `navigate('newScreen')` from any other screen.

## Styling

Screens are wrapped in a `<section class="screen">` tag. The `active` class is toggled by the `navigate` function in `main.js` to handle visibility and transitions. Animations are primarily handled via CSS in `style.css` using the `.screen.active` selector.
