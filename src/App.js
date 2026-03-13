import React,{ useState } from 'react';
import { Plus, Minus, Skull, RotateCcw } from 'lucide-react';
import { Player } from './player';



export default function MTGLifeCalculator()
{
    const[numPlayers, setNumPlayers]=useState(4);
    const[startingLife, setStartingLife]=useState(40);
    const[players, setPlayers]=useState([]);
    const[gameStarted, setGameStarted]=useState(false);

    const initializePlayers =()=>
    {
        const newPlayers=[];
        for(let i=0;i<numPlayers;i++)
        {
          const player = new Player(startingLife,`Player ${i + 1}`)
          player.numPlayers(numPlayers);
          newPlayers.push(player);

        }
        setPlayers(newPlayers);
        setGameStarted(true);
    };

    const updatePlayers=()=>
    {
      setPlayers([...players]);
    };
    const handleNameChange=(pIndex,name)=>
    {
      players[pIndex].setName(name);
      updatePlayers();
    };

    const resetGame=()=>
    {
        setGameStarted(false);
        setPlayers([]);
    };

    const adjustLife =(pIndex,life)=>
    {
        if(life>0)
        {
            players[pIndex].gainLife(life);
        }else
        {
            players[pIndex].takeDmg(Math.abs(life));
        }
        updatePlayers();
    };

    const adjustPoison=(pIndex,poison)=>
    {
        if(poison>0)
        {
            players[pIndex].takePoison(poison);
        }else
        {
          players[pIndex].removePoison(Math.abs(poison));
        }
        updatePlayers();
    };
    const adjustCommanderDamage=(pIndex,opponentIndex,commanderDamage)=>
    {
      if(commanderDamage>0)
      {
        players[pIndex].takeCommandDmg(commanderDamage,opponentIndex);
      }
      else
      {
        players[pIndex].removeCommandDmg(Math.abs(commanderDamage), opponentIndex);
      }
      updatePlayers();
    };
    const searchCardArt = async (pIndex, cardName) => {
      if (!cardName) return;
      
      try 
      {
        const response = await fetch
        (
          `https://api.scryfall.com/cards/named?fuzzy=${encodeURIComponent(cardName)}`
        );
        const data = await response.json();
          
        if (data.image_uris) 
        { 
          handleImageChange(pIndex, data.image_uris.art_crop);
        } else 
        {
          alert("Card not found! Try a more specific name.");
        }
      } catch (error) 
      {
        console.error("Error fetching Scryfall data:", error);
      }
  };



    if(!gameStarted)
    {
        return( 
          <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-xl shadow-2xl p-8 max-w-md w-full border border-gray-700">
          <h1 className="text-4xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">
            MTG Life Calculator
          </h1>
          
          <div className="space-y-6">
            <div>
              <label className="block text-gray-300 mb-2 font-semibold">Number of Players</label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setNumPlayers(Math.max(2, numPlayers - 1))}
                  className="bg-gray-700 hover:bg-gray-600 text-white p-3 rounded-lg transition"
                >
                  <Minus size={20} />
                </button>
                <span className="text-3xl font-bold text-white flex-1 text-center">{numPlayers}</span>
                <button
                  onClick={() => setNumPlayers(Math.min(8, numPlayers + 1))}
                  className="bg-gray-700 hover:bg-gray-600 text-white p-3 rounded-lg transition"
                >
                  <Plus size={20} />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-gray-300 mb-2 font-semibold">Starting Life</label>
              <div className="flex gap-2">
                {[20, 30, 40].map(life => (
                  <button
                    key={life}
                    onClick={() => setStartingLife(life)}
                    className={`flex-1 py-3 rounded-lg font-bold transition ${
                      startingLife === life
                        ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {life}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={initializePlayers}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-4 rounded-lg transition shadow-lg"
            >
              Start Game
            </button>
          </div>
        </div>
      </div>

        );
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">
              MTG Life Tracker
            </h1>
            <button
              onClick={resetGame}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition flex items-center gap-2"
            >
              <RotateCcw size={18} />
              New Game
            </button>
          </div>
    
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4">
            {players.map((player, index) => (
              <div
                key={index}
                /* --- 1. DYNAMIC BACKGROUND LOGIC --- */
                style={{
                  backgroundImage: player.imageUrl ? `linear-gradient(rgba(31, 41, 55, 0.85), rgba(31, 41, 55, 0.85)), url(${player.imageUrl})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
                className={`rounded-xl p-6 shadow-lg border-2 transition ${
                  player.getisDead()
                    ? 'bg-gray-900 border-red-800 opacity-60'
                    : 'bg-gray-800 border-gray-700'
                }`}
              >
                <div className="text-center mb-4">
                  <input
                    type="text"
                    value={player.getName()}
                    onChange={(e) => handleNameChange(index, e.target.value)}
                    className="bg-transparent text-xl font-bold text-white mb-2 text-center border-b border-transparent hover:border-gray-500 focus:border-orange-500 focus:outline-none transition w-full"
                    placeholder="Enter Name..."
                    disabled={player.getisDead()}
                  />
                  
                  {/* --- 2. SEARCH BAR UI --- */}
                  <div className="flex gap-1 mb-4">
                    <input
                      type="text"
                      placeholder="Search Commander art..."
                      className="flex-1 bg-gray-900/50 text-[10px] text-white p-1.5 rounded focus:outline-none focus:ring-1 focus:ring-orange-500"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') searchCardArt(index, e.target.value);
                      }}
                    />
                    <button 
                      onClick={(e) => searchCardArt(index, e.target.previousSibling.value)}
                      className="bg-gray-700 hover:bg-gray-600 text-white px-2 py-1 rounded text-[10px] transition"
                    >
                      Find
                    </button>
                  </div>
    
                  {player.getisDead() && (
                    <div className="flex items-center justify-center gap-2 text-red-500">
                      <Skull size={20} />
                      <span className="font-bold">DEFEATED</span>
                    </div>
                  )}
                </div>
    
                {/* ... Rest of your life total, poison, and commander damage code ... */}
                <div className="mb-6">
                  <div className="text-center mb-3">
                    <div className="text-5xl font-bold text-white mb-2">
                      {player.getLife()}
                    </div>
                    <div className="text-gray-400 text-sm">Life Total</div>
                  </div>
                  {/* (Buttons here - same as your current code) */}
                </div>
                
                {/* ... etc ... */}
              </div>
            ))}
          </div>
        </div>
      </div>
    )}