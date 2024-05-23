import React from 'react';

const PopupContent = ({ jsonData, onButtonClick, fetchData }) => {
  const handleButtonClick = () => {
    onButtonClick(jsonData); // 调用父组件传递过来的 onButtonClick 函数
    fetchData(); // 调用父组件传递过来的 fetchData 函数
  };

  return (
    <div key={JSON.stringify(jsonData)} className="PopupContent">
      <h2 className='Datatitle'>縣市資料</h2>
      <div>
        縣市: {jsonData['縣市別']}<br />
        幼兒園: {jsonData['幼兒園']}<br />
        國小: {jsonData['國小']}<br />
        國中: {jsonData['國中']}<br />
      </div>
      <button className="DataButton" onClick={handleButtonClick}>點擊我</button>
    </div>
  );
};

export default PopupContent;
