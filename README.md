🛡️ MTG Life Tracker


A sleek, modern, and mobile-friendly life-tracking application for Magic: The Gathering players. Designed for Commander (EDH) but flexible enough for any format. This was my first venture into web developement work and how things like node and javascript and React worked, this was in collaboration with Cade Nersveen, he did the backend developement work originally in Java and then I translated it into JS and then did the frontend work and also did a lot of the update work(player name changes,palyer cards having card art)
-------------------------------------------------------------------------------------------------------------------------------------------------
✨ Features
Multiplayer Support: Track life totals for 2 to 8 players simultaneously.

Dynamic Card Art: Search the Scryfall API to set any Magic card as a beautiful background for your player card.

Commander Damage Tracking: Built-in logic to track individual commander damage from every opponent.

Poison Counters: Integrated poison tracking with automatic "Defeated" state at 10 counters.

Responsive Design: Built with React and Tailwind CSS for a smooth experience on both phones and desktops.

Automatic Loss Detection: The app monitors life totals, poison, and commander damage to flag defeated players instantly.
-------------------------------------------------------------------------------------------------------------------------------------------------
🚀 Getting Started
Prerequisites
Node.js (v14 or higher)

npm or yarn
-------------------------------------------------------------------------------------------------------------------------------------------------
Installation
Clone the repository:
git clone https://github.com/Meyer07/mtg-life-calculator.git
cd mtg-life-calculator
-------------------------------------------------------------------------------------------------------------------------------------------------
Install dependencies:
npm install

Run the app:
npm start
-------------------------------------------------------------------------------------------------------------------------------------------------
🛠️ Built With
React: For the component-based UI.

Tailwind CSS: For the modern, "glassmorphism" styling and gradients.

Lucide React: For high-quality, lightweight icons.

Scryfall API: To fetch high-resolution card artwork.
-------------------------------------------------------------------------------------------------------------------------------------------------
📁 Project Structure
will update this section eventually when either I have enough alcohol to intoxicate myself to trudge through this or when I'm bored enough 
-------------------------------------------------------------------------------------------------------------------------------------------------
📝 How to Use
Setup: Select the number of players and starting life total (20, 30, or 40).

Customize: Type a card name (e.g., "Atraxa") into the search bar on a player card and hit Enter to set the background.

Play: Use the +/- buttons to adjust life and counters. The app will dim and mark a player as "Defeated" if they hit 0 life, 10 poison, or 21 commander damage from a single source.
-------------------------------------------------------------------------------------------------------------------------------------------------
🔮 Future Improvements
Game History Log: A scrollable side panel that records every action (e.g., "Player 1 took 5 damage from Player 2") for better transparency during complex turns.

Deck Integration: Allow users to paste a decklist link (from Moxfield or Archidekt) to automatically set the commander art and track deck-specific stats.

Network Multiplayer: Implement WebSockets or Firebase to allow players to join the same game from their own devices.

Dice Roller & Coin Flip: Integrated tools for determining who goes first or resolving "chaos" mechanics.

Monarch & City's Blessing: Dedicated toggles to track game-wide status effects.

Dark/Light Mode Toggle: Manual overrides for UI themes independent of the card art backgrounds.