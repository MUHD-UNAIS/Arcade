# Asset Library

This directory contains all the visual and brand assets for the **Little Big Feelings** game. All illustrations are provided in **SVG (Scalable Vector Graphics)** format to ensure crisp rendering on all screen sizes and resolutions.

## Asset Categories

| Directory | Content Description |
| :--- | :--- |
| `brand/` | Logos, typography, and core branding elements. |
| `avatars/` | Character options for player profiles. |
| `background/` | Full-screen background environments. |
| `emotion/` | Illustrations representing specific emotional states (e.g., Angry Monster). |
| `trigger/` | Visuals for situations that cause emotions (e.g., Broken Robot). |

## Source Attribution

The artwork in this project is inspired by the **"Recharge Without Charge"** curriculum by **Mind Empowered**. The visual style is designed to be:
- **Child-Friendly**: Bright colors, soft shapes, and expressive characters.
- **Narrative**: Each image tells a small story or represents a clear concept.
- **Accessible**: High contrast icons and clear semantic naming.

## Guidelines for New Assets
1.  **Format**: Use `.svg` whenever possible.
2.  **Naming**: Use `snake_case` (e.g., `sad_child_card.svg`).
3.  **Organization**: Place cards in their respective logical folders (`emotion` vs `trigger`) to maintain `gameData.js` clarity.
4.  **Optimization**: SVG files should be run through an optimizer (like SVGO) to remove unnecessary metadata.
