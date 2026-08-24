# 🌈 Feeling Fusion

An interactive web application & game designed to explore, combine, and navigate emotions through engaging gameplay mechanics ("Mood Mixer").

---

## 🚀 Features

- **Interactive Mood Mixing**: Combine different feelings and emotions to unlock outcomes and navigate through challenges.
- **Engaging UI & Animations**: Built with modern CSS design, vibrant gradients, fluid transitions, and responsive components.
- **Screen Navigation**: Modular screen flow including Splash, Interactive Tutorial, Mood Mixer workspace, Success, and Failure states.
- **Fullscreen Experience**: Seamless toggle for immersive full-screen gameplay.
- **Dynamic Icons & Typography**: Powered by Lucide Icons and Google Fonts (`Outfit`).

---

## 🛠️ Tech Stack

- **Frontend Core**: HTML5, Vanilla JavaScript (ES Modules)
- **Styling**: Vanilla CSS3 (Custom Design System, Glassmorphism, Responsive Layouts)
- **Icons**: Lucide Icons
- **Typography**: Google Fonts (*Outfit*)

---

## 📁 Project Structure

```
Feeling Fusion/
├── assets/             # Icons and static media assets
├── code/               # Main application modules
│   ├── Failure.js      # Failure screen view
│   ├── MoodMixer.js    # Core interactive gameplay screen
│   ├── Splash.js       # Welcome & start screen
│   ├── Success.js      # Victory / completion screen
│   ├── Tutorial.js     # Step-by-step game tutorial
│   ├── gameData.js     # Game data structures
│   ├── gameState.js    # Global state management
│   ├── moodMixerData.js# Emotional combinations & data
│   ├── style.css       # Core design system & component styles
│   └── utils/          # Utility scripts (e.g., fullscreen toggle)
├── index.html          # Application entry point
├── main.js             # Main application router and bootloader
└── readme.md           # Project documentation
```

---

## 🖥️ Running Locally

1. **Clone the repository**:
   ```bash
   git clone https://github.com/JustRamm/Feeling-Fusion.git
   cd "Feeling Fusion"
   ```

2. **Serve the project**:
   Since the app uses ES Modules, run it using any static HTTP server (e.g., VS Code Live Server or `npx serve`):
   ```bash
   npx serve .
   ```

3. **Open in browser**:
   Navigate to `http://localhost:3000` (or the URL provided by your local server).

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/JustRamm/Feeling-Fusion/issues).

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
