import React, { useState } from 'react';
import { Plus, Minus, Skull, RotateCcw, ShieldAlert } from 'lucide-react';
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
            <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 text-white">
                <div className="bg-gray-800 p-8 rounded-xl border border-gray-700 w-full max-w-md">
                    <h1 className="text-3xl font-bold mb-6 text-center text-orange-500">Magic The Gathering Life Tracker</h1>
                    <div className="space-y-6">
                        {/* Player Selection with Plus and Minus */}
                        <div className="text-center">
                            <label className="block mb-4 text-sm font-semibold text-gray-400 uppercase tracking-widest">Number of Players</label>
                            <div className="flex items-center justify-center gap-6">
                                <button 
                                    onClick={() => setNumPlayers(prev => Math.max(2, prev - 1))}
                                    className="p-3 bg-gray-700 rounded-full hover:bg-gray-600 transition shadow-lg"
                                >
                                    <Minus size={24} />
                                </button>
                                <span className="text-5xl font-black w-16">{numPlayers}</span>
                                <button 
                                    onClick={() => setNumPlayers(prev => Math.min(8, prev + 1))}
                                    className="p-3 bg-gray-700 rounded-full hover:bg-gray-600 transition shadow-lg"
                                >
                                    <Plus size={24} />
                                </button>
                            </div>
                        </div>

                        {/* Starting Life */}
                        <div className="flex gap-2">
                            {[20, 30, 40].map(val => (
                                <button 
                                    key={val} 
                                    onClick={() => setStartingLife(val)} 
                                    className={`flex-1 p-3 rounded-lg font-bold transition ${startingLife === val ? 'bg-orange-600 text-white shadow-lg' : 'bg-gray-700 text-gray-400'}`}
                                >
                                    {val}
                                </button>
                            ))}
                        </div>
                        
                        <button onClick={initializePlayers} className="w-full bg-green-600 p-4 rounded-xl font-bold text-xl shadow-lg hover:bg-green-500 transition">
                            Start Game
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-950 p-4 text-white">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">Magic The Gathering Life Tracker</h2>
                    <button onClick={resetGame} className="flex items-center gap-2 bg-gray-800 px-4 py-2 rounded text-sm hover:bg-gray-700 transition">
                        <RotateCcw size={16}/> Reset
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {players.map((player, index) => (
                        <div key={index} 
                             style={{ 
                                backgroundImage: player.imageUrl ? `linear-gradient(rgba(17, 24, 39, 0.8), rgba(17, 24, 39, 0.9)), url(${player.imageUrl})` : 'none',
                                backgroundSize: 'cover', backgroundPosition: 'center'
                             }}
                             className={`relative p-6 rounded-2xl border-2 transition-all ${player.isDead ? 'border-red-900 opacity-60 bg-gray-900' : 'border-gray-800 bg-gray-900'}`}>
                            
                            {/* Art Search */}
                            <input 
                                type="text" 
                                placeholder="Search card art..." 
                                onKeyDown={(e) => e.key === 'Enter' && searchCardArt(index, e.target.value)}
                                className="w-full bg-black/40 p-2 rounded text-xs mb-4 focus:outline-none border border-white/10"
                            />

                            {/* Name & Status */}
                            <div className="text-center mb-4">
                                <input value={player.name} onChange={(e) => handleNameChange(index, e.target.value)} className="bg-transparent text-center font-bold text-xl w-full border-b border-white/10 focus:outline-none" />
                                {player.isDead && <div className="text-red-500 text-xs font-bold mt-1 flex justify-center items-center gap-1"><Skull size={14}/> DEFEATED</div>}
                            </div>

                            {/* Life Total */}
                            <div className="text-center mb-6">
                                <span className="text-6xl font-black block mb-4">{player.life}</span>
                                <div className="flex gap-2">
                                    <button onClick={() => adjustLife(index, -5)} className="flex-1 bg-red-900/50 p-2 rounded hover:bg-red-800 transition">-5</button>
                                    <button onClick={() => adjustLife(index, -1)} className="flex-1 bg-red-700/50 p-2 rounded hover:bg-red-600 transition">-1</button>
                                    <button onClick={() => adjustLife(index, 1)} className="flex-1 bg-green-700/50 p-2 rounded hover:bg-green-600 transition">+1</button>
                                    <button onClick={() => adjustLife(index, 5)} className="flex-1 bg-green-900/50 p-2 rounded hover:bg-green-800 transition">+5</button>
                                </div>
                            </div>

                            {/* DYNAMIC COUNTER PILLS */}
                            <div className="flex flex-wrap gap-2 mb-4 min-h-[32px]">
                                {Object.entries(player.counters).map(([type, count]) => (
                                    count > 0 && (
                                        <div key={type} className="flex items-center gap-2 bg-purple-900/40 border border-purple-500/50 px-3 py-1 rounded-full animate-in fade-in zoom-in duration-300">
                                            <span className="text-[10px] font-bold uppercase tracking-wider">{type}</span>
                                            <span className="font-bold">{count}</span>
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
                                            <span className="text-gray-400 uppercase font-semibold">From P{sourceIdx + 1}</span>
                                            <div className="flex items-center gap-3">
                                                <button onClick={() => adjustCommanderDamage(index, sourceIdx, -1)} className="text-gray-500 hover:text-white">-</button>
                                                <span className="font-bold text-orange-400">{dmg}</span>
                                                <button onClick={() => adjustCommanderDamage(index, sourceIdx, 1)} className="text-gray-500 hover:text-white">+</button>
                                            </div>
                                        </div>
                                    )
                                ))}
                            </div>

                            {/* ADD COUNTER MENU */}
                            <div className="relative">
                                <button 
                                    onClick={() => setActiveMenu(activeMenu === index ? null : index)}
                                    className="w-full bg-gray-800/80 hover:bg-gray-700 py-2 rounded text-[10px] uppercase font-bold tracking-widest flex items-center justify-center gap-2 transition"
                                >
                                    <ShieldAlert size={12}/> Manage Counters
                                </button>
                                
                                {activeMenu === index && (
                                    <div className="absolute bottom-full mb-2 left-0 w-full bg-gray-800 border border-gray-600 rounded-lg shadow-2xl p-2 z-50 grid grid-cols-2 gap-2 animate-in slide-in-from-bottom-2">
                                        {Object.keys(player.counters).map(type => (
                                            <button 
                                                key={type}
                                                onClick={() => { handleCounterChange(index, type, 1); setActiveMenu(null); }}
                                                className="bg-gray-700 hover:bg-purple-700 p-2 rounded text-[10px] uppercase font-bold transition text-white"
                                            >
                                                {type}
                                            </button>
                                        ))}
                                        {players.map((_, oppIdx) => (
                                            oppIdx !== index && (
                                                <button 
                                                    key={oppIdx}
                                                    onClick={() => { adjustCommanderDamage(index, oppIdx, 1); setActiveMenu(null); }}
                                                    className="bg-gray-700 hover:bg-orange-700 p-2 rounded text-[10px] uppercase font-bold transition text-white"
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