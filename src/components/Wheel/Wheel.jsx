import React from "react";
import { useState, useRef } from "react";
import prizes from './../../assets/data.jsx'
import BtnStart from "./../btnStart/BtnStart.jsx";
import "./wheel.css"

function Wheel({ saveResultToHistory, updateStats, stats }) {
  const textWin = useRef(0)
  const spinnerRef = useRef(null);
  const [selectedPrize, setSelectedPrize] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const prizeSlice = 360 / prizes.length;
  const prizeOffset = Math.floor(180 / prizes.length);



  const spinertia = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };


  const StartAnim = () => {
    textWin.current.style.display = 'none'
    setSelectedPrize(0)
    let rotationCount = Math.floor(Math.random() * 360 + spinertia(2000, 5000));

    spinnerRef.current.style.transform = `rotate(${rotationCount}deg)`;

    var selected = Math.floor((rotationCount % 360) / prizeSlice) - 1;
    if (selected == -1) {
      selected = 7;
    }
    setIsSpinning(true);

    setTimeout(() => {
      setSelectedPrize(selected);
      setIsSpinning(false);
      saveResultToHistory(prizes[selected].text, selected)
      updateStats(prizes[selected].text, selected)
      textWin.current.style.display = 'block'
    }, 4000)
  };



  const gradient = () => {
    return prizes.map((prize, index) => {
      let percent = (100 / prizes.length) * (prizes.length - index);

      return `${prize.color} 0 ${percent}%`;


    }).reverse();
  }

  return <div className="wheel">
    <div className="deal-wheel">

      <div className={`spinner ${isSpinning ? 'is-spinning' : ''}`}
        style={{
          background: `conic-gradient(
                from -90deg, 
                ${gradient()}
                )`,

          transition: isSpinning ? 'transform 4s ease-out' : 'none'

        }}
        ref={spinnerRef}>

        {prizes.map((prize, index) => {
          const rotationPrize = ((prizeSlice * (index + 1)) * -1) - prizeOffset;

          return (
            <li key={index} className="prize" style={{ '--rotate': `${rotationPrize}deg` }}>
              <span className="text">{prize.text}</span>
            </li>
          )
        })}
      </div>

      <div className="ticker" ></div>

      <BtnStart isSpinning={isSpinning}
        stats={stats}
        StartAnim={StartAnim} />

    </div>
    <h3
      className="text_win"
      ref={textWin}
      style={{
        textAlign: "center",
        display: "none",
      }}
    >
      {selectedPrize !== 5 ? ` Ваш выигрыш: ${prizes[selectedPrize].text}` : 'Не повезло :('}
      {console.log(selectedPrize)}
    </h3>
  </div>;
}

export default Wheel;
