import React, { useState } from 'react';
import { Skull, RotateCcw, ShieldAlert, Plus, Minus } from 'lucide-react';
import { Player } from './player';

export default function MTGLifeCalculator() {
    const [numPlayers, setNumPlayers] = useState(4);
    const [startingLife, setStartingLife] = useState(40);
    const [players, setPlayers] = useState([]);
    const [gameStarted, setGameStarted] = useState(false);
    const [activeMenu, setActiveMenu] = useState(null);

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

    const updatePlayers = () => 
    {
        setPlayers(players.map(p => 
        {
            return Object.assign(Object.create(Object.getPrototypeOf(p)), p);
        }));
    };
    const resetGame = () => { setGameStarted(false); setPlayers([]); setActiveMenu(null); };

    const adjustLife = (pIndex, life) => {
        if (life > 0) players[pIndex].gainLife(life);
        else players[pIndex].takeDmg(Math.abs(life));
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

    const handleCounterChange = (pIndex, type, amount) => {
        players[pIndex].adjustCounter(type, amount);
        updatePlayers();
    };

    const searchCardArt = async (pIndex, cardName) => {
        if (!cardName) return;
        const banned = ["Invoke Prejudice", "Jihad", "Crusade", "Pradesh Gypsies", "Imprison", "Cleanse", "Stone-Throwing Devils"];
        if (banned.some(name => cardName.toLowerCase().includes(name.toLowerCase()))) {
            alert("Restricted Art");
            return;
        }
        try {
            const response = await fetch(`https://api.scryfall.com/cards/named?fuzzy=${encodeURIComponent(cardName)}`);
            const data = await response.json();
            if (data.image_uris) {
                players[pIndex].imageUrl = data.image_uris.art_crop;
                updatePlayers();
            }
        } catch (error) { console.error(error); }
    };

    if (!gameStarted) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6 text-white">
                <div className="bg-gray-800 p-8 rounded-2xl border border-gray-700 w-full max-w-sm">
                    <h1 className="text-3xl font-black mb-8 text-center text-orange-500 tracking-tighter uppercase">Magic The Gathering Life Tracker</h1>
                    <div className="space-y-10">
                        <div className="text-center">
                            <label className="block mb-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Players</label>
                            <div className="flex items-center justify-between px-4">
                                <button onClick={() => setNumPlayers(Math.max(2, numPlayers - 1))} className="p-4 bg-gray-700 rounded-full active:scale-95 transition-transform"><Minus /></button>
                                <span className="text-5xl font-black">{numPlayers}</span>
                                <button onClick={() => setNumPlayers(Math.min(8, numPlayers + 1))} className="p-4 bg-gray-700 rounded-full active:scale-95 transition-transform"><Plus /></button>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            {[20, 30, 40].map(val => (
                                <button key={val} onClick={() => setStartingLife(val)} className={`flex-1 py-4 rounded-xl font-bold transition-colors ${startingLife === val ? 'bg-orange-600' : 'bg-gray-700'}`}>{val}</button>
                            ))}
                        </div>
                        <button onClick={initializePlayers} className="w-full bg-green-600 py-5 rounded-2xl font-black text-xl shadow-lg active:bg-green-500 transition-colors">START MATCH</button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-950 text-white pb-20 font-sans">
            <div className="sticky top-0 z-50 bg-gray-950/80 backdrop-blur-md border-b border-white/5 p-4 flex justify-between items-center mb-4">
                <h2 className="font-bold text-xs tracking-widest text-gray-400 uppercase">Magic The Gathering Life Tracker</h2>
                <button onClick={resetGame} className="bg-gray-800 px-4 py-2 rounded-lg text-xs flex items-center gap-2 font-bold"><RotateCcw size={14}/> RESET</button>
            </div>

            <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {players.map((player, index) => (
                        <div key={index} 
                             style={{ backgroundImage: player.imageUrl ? `linear-gradient(rgba(17, 24, 39, 0.85), rgba(17, 24, 39, 0.95)), url(${player.imageUrl})` : 'none', backgroundSize: 'cover', backgroundPosition: 'center' }}
                             className={`relative p-5 rounded-3xl border-2 transition-all ${player.isDead ? 'border-red-900 opacity-50' : 'border-gray-800 bg-gray-900'}`}>
                            
                            <input 
                                type="text" placeholder="Search art..." 
                                onKeyDown={(e) => e.key === 'Enter' && searchCardArt(index, e.target.value)}
                                className="w-full bg-black/40 p-3 rounded-xl text-base mb-4 focus:outline-none border border-white/5"
                            />

                            <div className="text-center mb-4">
                                <input value={player.name} onChange={(e) => handleNameChange(index, e.target.value)} className="bg-transparent text-center font-bold text-xl w-full border-b border-white/10 focus:outline-none" />
                                {player.isDead && <div className="text-red-500 text-xs font-bold mt-1 uppercase flex justify-center items-center gap-1"><Skull size={14}/> Defeated</div>}
                            </div>

                            <div className="text-center mb-6">
                                <span className="text-7xl font-black block mb-6 tracking-tighter tabular-nums">{player.life}</span>
                                <div className="flex gap-2 h-16">
                                    <button onClick={() => adjustLife(index, -5)} className="flex-1 bg-red-900/40 rounded-xl font-bold">-5</button>
                                    <button onClick={() => adjustLife(index, -1)} className="flex-1 bg-gray-800 rounded-xl font-bold text-lg">-1</button>
                                    <button onClick={() => adjustLife(index, 1)} className="flex-1 bg-orange-600 rounded-xl font-bold text-lg">+1</button>
                                    <button onClick={() => adjustLife(index, 5)} className="flex-1 bg-green-900/40 rounded-xl font-bold">+5</button>
                                </div>
                            </div>

                            {/* Commander Damage Display (Restored) */}
                            <div className="space-y-2 mb-4">
                                {player.commanderDamage && player.commanderDamage.map((dmg, sourceIdx) => (
                                    sourceIdx !== index && dmg > 0 && (
                                        <div key={sourceIdx} className="flex justify-between items-center bg-black/40 p-3 rounded-xl border border-white/5">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase">From P{sourceIdx + 1}</span>
                                            <div className="flex items-center gap-4">
                                                <button onClick={() => adjustCommanderDamage(index, sourceIdx, -1)} className="p-1 active:scale-150 text-red-400 transition-transform"><Minus size={16}/></button>
                                                <span className="font-black text-orange-500 text-lg tabular-nums">{dmg}</span>
                                                <button onClick={() => adjustCommanderDamage(index, sourceIdx, 1)} className="p-1 active:scale-150 text-green-400 transition-transform"><Plus size={16}/></button>
                                            </div>
                                        </div>
                                    )
                                ))}
                            </div>

                            {/* Counter Pills */}
                            <div className="flex flex-wrap gap-2 mb-4">
                                {Object.entries(player.counters).map(([type, count]) => (
                                    count > 0 && (
                                        <div key={type} className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-full">
                                            <span className="text-[10px] font-bold uppercase text-gray-400">{type}</span>
                                            <span className="font-bold">{count}</span>
                                            <div className="flex gap-4 ml-2 border-l border-white/10 pl-3">
                                                <button onClick={() => handleCounterChange(index, type, -1)} className="text-red-400 font-bold text-lg">-</button>
                                                <button onClick={() => handleCounterChange(index, type, 1)} className="text-green-400 font-bold text-lg">+</button>
                                            </div>
                                        </div>
                                    )
                                ))}
                            </div>

                            <button 
                                onClick={() => setActiveMenu(activeMenu === index ? null : index)}
                                className="w-full bg-gray-800 py-4 rounded-xl text-xs font-black tracking-widest flex items-center justify-center gap-2"
                            >
                                <ShieldAlert size={16}/> Manage Counters
                            </button>

                            {/* Overlay Menu for Mobile */}
                            {activeMenu === index && (
                                <div className="absolute inset-0 z-50 bg-gray-900/95 p-6 rounded-3xl grid grid-cols-2 gap-3 animate-in fade-in zoom-in duration-200 overflow-y-auto">
                                    <button onClick={() => setActiveMenu(null)} className="col-span-2 text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest">Close Menu</button>
                                    {Object.keys(player.counters).map(type => 
                                    (
                                        <button key={type} onClick={() => { handleCounterChange(index, type, 1); setActiveMenu(null); }} className="bg-gray-800 p-4 rounded-xl text-[10px] font-bold uppercase text-white">{type}</button>
                                    ))}
                                    {players.map((_, oppIdx) => 
                                    (
                                        oppIdx !== index && 
                                        (
                                            <button key={oppIdx} onClick={() => { adjustCommanderDamage(index, oppIdx, 1); setActiveMenu(null); }} className="bg-orange-900/20 text-orange-400 border border-orange-500/20 p-4 rounded-xl text-[10px] font-bold uppercase">P{oppIdx + 1} Dmg</button>
                                        )
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}