import React, { useState } from 'react';
import { Skull, RotateCcw, ShieldAlert } from 'lucide-react';
import { Player } from './player';

export default function MTGLifeCalculator() {
    const [numPlayers, setNumPlayers] = useState(4);
    const [startingLife, setStartingLife] = useState(40);
    const [players, setPlayers] = useState([]);
    const [gameStarted, setGameStarted] = useState(false);
    const [activeMenu,setActiveMenu]=useState(null);

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

    const searchCardArt = async (pIndex, cardName) => {
        if (!cardName) return;

        const bannedCards=["Invoke Prejudice","Jihad","Crusade","Pradesh Gypsies","Imprison","Cleanse","Stone-Throwing Devils"];
        if(bannedCards.some(name=>cardName.toLowerCase().includes(name.toLowerCase())))
        {
            alert("This card has been banned for racial/cultural insensitvity");
            return;
        }
        try {
            const response = await fetch(`https://api.scryfall.com/cards/named?fuzzy=${encodeURIComponent(cardName)}`);
            const data = await response.json();
            if (data.image_uris) 
            {
                players[pIndex].imageUrl = data.image_uris.art_crop;
                updatePlayers();
            }
            
        } catch (error) { console.error("Search error:", error); }
    };
    const handleCounterChange=(pIndex,type,amount)=>
    {
        players[pIndex].adjustCounter(type,amount);
        updatePlayers();
    }

    if (!gameStarted) {
        return (
            <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4 text-white">
                <div className="bg-gray-900 p-8 rounded-2xl border border-gray-800 w-full max-w-md shadow-2xl">
                    <h1 className="text-3xl font-black mb-8 text-center tracking-tighter text-orange-500">
                        Magic The Gathering Life Tracker
                    </h1>

                    <div className="space-y-8">
                        {/* Player Count Selection - Reverted to Buttons */}
                        <div>
                            <label className="block text-xs uppercase tracking-widest font-bold text-gray-500 mb-4 text-center">
                                Select Player Count
                            </label>
                            <div className="grid grid-cols-3 gap-3">
                                {[2, 3, 4, 5, 6, 8].map(num => (
                                    <button
                                        key={num}
                                        onClick={() => setNumPlayers(num)}
                                        className={`p-4 rounded-xl font-bold transition-all border-2 ${numPlayers === num
                                                ? 'bg-orange-600 border-orange-400 scale-105 shadow-lg shadow-orange-900/20'
                                                : 'bg-gray-800 border-transparent text-gray-400 hover:bg-gray-700'
                                            }`}
                                    >
                                        {num}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Starting Life Selection */}
                        <div>
                            <label className="block text-xs uppercase tracking-widest font-bold text-gray-500 mb-4 text-center">
                                Starting Life
                            </label>
                            <div className="flex gap-3">
                                {[20, 30, 40].map(val => (
                                    <button
                                        key={val}
                                        onClick={() => setStartingLife(val)}
                                        className={`flex-1 p-3 rounded-xl font-bold transition-all border-2 ${startingLife === val
                                                ? 'bg-orange-600 border-orange-400'
                                                : 'bg-gray-800 border-transparent text-gray-400 hover:bg-gray-700'
                                            }`}
                                    >
                                        {val}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={initializePlayers}
                            className="w-full bg-white text-black hover:bg-orange-500 hover:text-white p-4 rounded-xl font-black uppercase tracking-widest transition-all mt-4"
                        >
                            Start Match
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-950 p-4 text-white font-sans">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold tracking-tight text-gray-200">Magic The Gathering Life Tracker</h2>
                    <button onClick={resetGame} className="flex items-center gap-2 bg-gray-900 border border-gray-800 px-4 py-2 rounded text-sm hover:bg-gray-800 transition">
                        <RotateCcw size={16} /> Reset
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {players.map((player, index) => (
                        <div key={index}
                            style={{
                                backgroundImage: player.imageUrl
                                    ? `linear-gradient(rgba(31, 41, 55, 0.85), rgba(31, 41, 55, 0.85)), url(${player.imageUrl})`
                                    : 'none',
                                backgroundSize: 'cover',
                                backgroundPosition: 'center'
                            }}
                            className={`relative p-6 rounded-2xl border-2 transition-all ${player.isDead
                                    ? 'border-red-900 opacity-60 bg-gray-900'
                                    : 'border-gray-800 bg-gray-900'
                                }`}>

                            {/* Art Search */}
                            <input
                                type="text"
                                placeholder="Search card art..."
                                onKeyDown={(e) => e.key === 'Enter' && searchCardArt(index, e.target.value)}
                                className="w-full bg-black/40 p-2 rounded text-xs mb-4 focus:outline-none border border-white/10"
                            />

                            {/* Name & Status */}
                            <div className="text-center mb-4">
                                <input value={player.name} onChange={(e) => handleNameChange(index, e.target.value)} className="bg-transparent text-center font-bold text-xl w-full border-b border-white/10" />
                                {player.isDead && <div className="text-red-500 text-xs font-bold mt-1 flex justify-center items-center gap-1"><Skull size={14} /> DEFEATED</div>}
                            </div>

                            {/* Life Total - Reverted to Gray/Orange Palette */}
                            <div className="text-center mb-6">
                                <span className="text-6xl font-black block mb-4">{player.life}</span>
                                <div className="flex gap-2">
                                    <button onClick={() => adjustLife(index, -5)} className="flex-1 bg-gray-800 hover:bg-gray-700 p-2 rounded transition">-5</button>
                                    <button onClick={() => adjustLife(index, -1)} className="flex-1 bg-gray-700 hover:bg-gray-600 p-2 rounded transition">-1</button>
                                    <button onClick={() => adjustLife(index, 1)} className="flex-1 bg-orange-600 hover:bg-orange-500 p-2 rounded transition">+1</button>
                                    <button onClick={() => adjustLife(index, 5)} className="flex-1 bg-orange-700 hover:bg-orange-600 p-2 rounded transition">+5</button>
                                </div>
                            </div>

                            {/* DYNAMIC COUNTER PILLS (Only shows when > 0) */}
                            <div className="flex flex-wrap gap-2 mb-4 min-h-[32px]">
                                {Object.entries(player.counters).map(([type, count]) => (
                                    count > 0 && (
                                        <div key={type} className="flex items-center gap-2 bg-gray-900/90 border border-gray-700 px-3 py-1 rounded-full animate-in fade-in zoom-in duration-300">
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{type}</span>
                                            <span className="font-bold text-white">{count}</span>
                                            <div className="flex gap-2 ml-1 border-l border-white/20 pl-2">
                                                <button onClick={() => handleCounterChange(index, type, -1)} className="hover:text-red-400 font-bold">-</button>
                                                <button onClick={() => handleCounterChange(index, type, 1)} className="hover:text-green-400 font-bold">+</button>
                                            </div>
                                        </div>
                                    )
                                ))}
                            </div>

                            {/* Commander Damage Display */}
                            <div className="space-y-2 mb-4">
                                {player.commanderDamage.map((dmg, sourceIdx) => (
                                    sourceIdx !== index && dmg > 0 && (
                                        <div key={sourceIdx} className="flex justify-between items-center text-xs bg-black/30 p-2 rounded">
                                            <span className="text-gray-400 uppercase">From P{sourceIdx + 1}</span>
                                            <div className="flex items-center gap-3">
                                                <button onClick={() => adjustCommanderDamage(index, sourceIdx, -1)} className="text-gray-400 hover:text-white">-</button>
                                                <span className="font-bold text-orange-500">{dmg}</span>
                                                <button onClick={() => adjustCommanderDamage(index, sourceIdx, 1)} className="text-gray-400 hover:text-white">+</button>
                                            </div>
                                        </div>
                                    )
                                ))}
                            </div>

                            {/* ADD COUNTER MENU - Reverted to Gray/Neutral Theme */}
                            <div className="relative">
                                <button
                                    onClick={() => setActiveMenu(activeMenu === index ? null : index)}
                                    className="w-full bg-gray-800/80 hover:bg-gray-700 py-2 rounded text-[10px] uppercase font-bold tracking-widest flex items-center justify-center gap-2 text-gray-300"
                                >
                                    <ShieldAlert size={12} /> Manage Counters
                                </button>

                                {activeMenu === index && (
                                    <div className="absolute bottom-full mb-2 left-0 w-full bg-gray-800 border border-gray-700 rounded-lg shadow-2xl p-2 z-50 grid grid-cols-2 gap-2 animate-in slide-in-from-bottom-2">
                                        {Object.keys(player.counters).map(type => (
                                            <button
                                                key={type}
                                                onClick={() => { handleCounterChange(index, type, 1); setActiveMenu(null); }}
                                                className="bg-gray-700 hover:bg-orange-600 p-2 rounded text-[10px] uppercase font-bold text-white transition"
                                            >
                                                {type}
                                            </button>
                                        ))}
                                        {players.map((_, oppIdx) => (
                                            oppIdx !== index && (
                                                <button
                                                    key={oppIdx}
                                                    onClick={() => { adjustCommanderDamage(index, oppIdx, 1); setActiveMenu(null); }}
                                                    className="bg-gray-700 hover:bg-orange-700 p-2 rounded text-[10px] uppercase font-bold text-white transition"
                                                >
                                                    Commander Dmg (P{oppIdx + 1})
                                                </button>
                                            )
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}