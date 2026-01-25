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
            players[pIndex].takePoison(Math.abs(poison));
        }
        updatePlayers();
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

    return(
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
              className={`rounded-xl p-6 shadow-lg border-2 transition ${
                player.getisDead()
                  ? 'bg-gray-900 border-red-800 opacity-60'
                  : 'bg-gray-800 border-gray-700'
              }`}
            >
              <div className="text-center mb-4">
                <h2 className="text-xl font-bold text-white mb-2">{player.getName()}</h2>
                {player.getisDead() && (
                  <div className="flex items-center justify-center gap-2 text-red-500">
                    <Skull size={20} />
                    <span className="font-bold">DEFEATED</span>
                  </div>
                )}
              </div>

              <div className="mb-6">
                <div className="text-center mb-3">
                  <div className="text-5xl font-bold text-white mb-2">
                    {player.getLife()}
                  </div>
                  <div className="text-gray-400 text-sm">Life Total</div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => adjustLife(index, -1)}
                    className="flex-1 bg-red-600 hover:bg-red-500 text-white py-2 rounded-lg transition"
                    disabled={player.getisDead()}
                  >
                    -1
                  </button>
                  <button
                    onClick={() => adjustLife(index, -5)}
                    className="flex-1 bg-red-700 hover:bg-red-600 text-white py-2 rounded-lg transition"
                    disabled={player.getisDead()}
                  >
                    -5
                  </button>
                  <button
                    onClick={() => adjustLife(index, 1)}
                    className="flex-1 bg-green-600 hover:bg-green-500 text-white py-2 rounded-lg transition"
                    disabled={player.getisDead()}
                  >
                    +1
                  </button>
                  <button
                    onClick={() => adjustLife(index, 5)}
                    className="flex-1 bg-green-700 hover:bg-green-600 text-white py-2 rounded-lg transition"
                    disabled={player.getisDead()}
                  >
                    +5
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="bg-gray-900 rounded-lg p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-purple-400 font-semibold text-sm">Poison</span>
                    <span className="text-white font-bold text-lg">{player.poisonCount}</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => adjustPoison(index, -1)}
                      className="flex-1 bg-purple-700 hover:bg-purple-600 text-white py-1 rounded transition text-sm"
                      disabled={player.getisDead()}
                    >
                      -1
                    </button>
                    <button
                      onClick={() => adjustPoison(index, 1)}
                      className="flex-1 bg-purple-600 hover:bg-purple-500 text-white py-1 rounded transition text-sm"
                      disabled={player.getisDead()}
                    >
                      +1
                    </button>
                  </div>
                </div>

                {player.commanderDamage.some(dmg => dmg > 0) && (
                  <div className="bg-gray-900 rounded-lg p-3">
                    <div className="text-orange-400 font-semibold text-sm mb-2">Commander Damage</div>
                    {player.commanderDamage.map((dmg, cmdIndex) => (
                      dmg > 0 && (
                        <div key={cmdIndex} className="text-gray-300 text-sm">
                          P{cmdIndex + 1}: {dmg}
                        </div>
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