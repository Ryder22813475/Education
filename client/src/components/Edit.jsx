import React, { useState } from 'react';

const AnotherComponent = ({ jsonData, onSave, onCancel, onUpdatePopupContent }) => {
  const [editedData, setEditedData] = useState(jsonData);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setEditedData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSave = () => {
    onSave(editedData); // 保存数据
    onUpdatePopupContent(editedData); // 更新 PopupContent 的内容
  };

  return (
    <div className="AnotherComponent">
      <h2 className='Datatitle'>修改資料</h2>
      <div>
        <label>幼兒園: </label>
        <input type="text" name="幼兒園" value={editedData['幼兒園']} onChange={handleChange} /><br />
        <label>國小: </label>
        <input type="text" name="國小" value={editedData['國小']} onChange={handleChange} /><br />
        <label>國中: </label>
        <input type="text" name="國中" value={editedData['國中']} onChange={handleChange} /><br />
      </div>
      <button onClick={handleSave}>保存</button>
      <button onClick={onCancel}>取消</button>
    </div>
  );
};

export default AnotherComponent;
