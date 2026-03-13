import React, { useState } from 'react';
import { Plus, Minus, Skull, RotateCcw } from 'lucide-react';
import { Player } from './player';

export default function MTGLifeCalculator() {
    const [numPlayers, setNumPlayers] = useState(4);
    const [startingLife, setStartingLife] = useState(40);
    const [players, setPlayers] = useState([]);
    const [gameStarted, setGameStarted] = useState(false);

    const initializePlayers = () => {
        const newPlayers = [];
        for (let i = 0; i < numPlayers; i++) {
            const player = new Player(startingLife, `Player ${i + 1}`);
            player.numPlayers(numPlayers);
            newPlayers.push(player);
        }
        setPlayers(newPlayers);
        setGameStarted(true);
    };

    const updatePlayers = () => setPlayers([...players]);
    const resetGame = () => { setGameStarted(false); setPlayers([]); };

    const adjustLife = (pIndex, life) => {
        if (life > 0) players[pIndex].gainLife(life);
        else players[pIndex].takeDmg(Math.abs(life));
        updatePlayers();
    };

    const adjustPoison = (pIndex, poison) => {
        if (poison > 0) players[pIndex].takePoison(poison);
        else players[pIndex].removePoison(Math.abs(poison));
        updatePlayers();
    };

    const adjustCommanderDamage = (pIndex, opponentIndex, amount) => {
        if (amount > 0) players[pIndex].takeCommandDmg(amount, opponentIndex);
        else players[pIndex].removeCommandDmg(Math.abs(amount), opponentIndex);
        updatePlayers();
    };

    const handleNameChange = (pIndex, newName) => {
        players[pIndex].name = newName;
        updatePlayers();
    };

    const searchCardArt = async (pIndex, cardName) => {
        if (!cardName) return;
        try {
            const response = await fetch(`https://api.scryfall.com/cards/named?fuzzy=${encodeURIComponent(cardName)}`);
            const data = await response.json();
            if (data.image_uris) {
                players[pIndex].imageUrl = data.image_uris.art_crop;
                updatePlayers();
            }
        } catch (error) { console.error("Search error:", error); }
    };

    if (!gameStarted) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
                <div className="bg-gray-800 rounded-xl shadow-2xl p-8 max-w-md w-full border border-gray-700">
                    <h1 className="text-4xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">MTG Life Calculator</h1>
                    <div className="space-y-6">
                        <div>
                            <label className="block text-gray-300 mb-2 font-semibold">Number of Players</label>
                            <div className="flex items-center gap-4">
                                <button onClick={() => setNumPlayers(Math.max(2, numPlayers - 1))} className="bg-gray-700 text-white p-3 rounded-lg"><Minus size={20} /></button>
                                <span className="text-3xl font-bold text-white flex-1 text-center">{numPlayers}</span>
                                <button onClick={() => setNumPlayers(Math.min(8, numPlayers + 1))} className="bg-gray-700 text-white p-3 rounded-lg"><Plus size={20} /></button>
                            </div>
                        </div>
                        <div>
                            <label className="block text-gray-300 mb-2 font-semibold">Starting Life</label>
                            <div className="flex gap-2">
                                {[20, 30, 40].map(life => (
                                    <button key={life} onClick={() => setStartingLife(life)} className={`flex-1 py-3 rounded-lg font-bold ${startingLife === life ? 'bg-orange-500 text-white' : 'bg-gray-700 text-gray-300'}`}>{life}</button>
                                ))}
                            </div>
                        </div>
                        <button onClick={initializePlayers} className="w-full bg-orange-600 text-white font-bold py-4 rounded-lg shadow-lg">Start Game</button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">MTG Life Tracker</h1>
                    <button onClick={resetGame} className="bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"><RotateCcw size={18} /> New Game</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4">
                    {players.map((player, index) => (
                        <div key={index} style={{ backgroundImage: player.imageUrl ? `linear-gradient(rgba(31, 41, 55, 0.85), rgba(31, 41, 55, 0.85)), url(${player.imageUrl})` : 'none', backgroundSize: 'cover', backgroundPosition: 'center' }} className={`rounded-xl p-6 shadow-lg border-2 transition ${player.getisDead() ? 'bg-gray-900 border-red-800 opacity-60' : 'bg-gray-800 border-gray-700'}`}>
                            <div className="text-center mb-4">
                                <input type="text" placeholder="Search art..." className="w-full bg-gray-900/50 text-[10px] text-white p-1 rounded mb-2" onKeyDown={(e) => e.key === 'Enter' && searchCardArt(index, e.target.value)} />
                                <input type="text" value={player.name} onChange={(e) => handleNameChange(index, e.target.value)} className="bg-transparent text-xl font-bold text-white text-center w-full" disabled={player.getisDead()} />
                                {player.getisDead() && <div className="flex items-center justify-center gap-2 text-red-500 mt-1"><Skull size={18} /><span className="text-xs font-bold">DEFEATED</span></div>}
                            </div>
                            <div className="mb-6 text-center">
                                <div className="text-5xl font-bold text-white mb-3">{player.getLife()}</div>
                                <div className="flex gap-2">
                                    <button onClick={() => adjustLife(index, -1)} className="flex-1 bg-red-600 p-2 rounded-lg text-white">-1</button>
                                    <button onClick={() => adjustLife(index, -5)} className="flex-1 bg-red-800 p-2 rounded-lg text-white">-5</button>
                                    <button onClick={() => adjustLife(index, 1)} className="flex-1 bg-green-600 p-2 rounded-lg text-white">+1</button>
                                    <button onClick={() => adjustLife(index, 5)} className="flex-1 bg-green-800 p-2 rounded-lg text-white">+5</button>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="bg-gray-900/80 rounded-lg p-3">
                                    <div className="flex justify-between items-center mb-2"><span className="text-purple-400 text-xs font-semibold">Poison</span><span className="text-white font-bold">{player.poisonCount}</span></div>
                                    <div className="flex gap-2">
                                        <button onClick={() => adjustPoison(index, -1)} className="flex-1 bg-purple-900 p-1 rounded text-xs text-white">-1</button>
                                        <button onClick={() => adjustPoison(index, 1)} className="flex-1 bg-purple-700 p-1 rounded text-xs text-white">+1</button>
                                    </div>
                                </div>
                                <div className="bg-gray-900/80 rounded-lg p-3">
                                    <div className="text-orange-400 text-xs font-semibold mb-2">Commander Damage</div>
                                    <div className="space-y-2">
                                        {player.commanderDamage.map((dmg, cmdIndex) => (
                                            cmdIndex !== index && (
                                                <div key={cmdIndex} className="flex justify-between items-center bg-gray-800/50 p-1 rounded">
                                                    <span className="text-gray-400 text-[10px]">From P{cmdIndex + 1}</span>
                                                    <div className="flex items-center gap-2">
                                                        <button onClick={() => adjustCommanderDamage(index, cmdIndex, -1)} className="bg-gray-700 text-white px-1.5 rounded text-[10px]">-</button>
                                                        <span className="text-white text-xs font-bold">{dmg}</span>
                                                        <button onClick={() => adjustCommanderDamage(index, cmdIndex, 1)} className="bg-gray-700 text-white px-1.5 rounded text-[10px]">+</button>
                                                    </div>
                                                </div>
                                            )
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}