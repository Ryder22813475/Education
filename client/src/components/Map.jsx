import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import PopupContent from './PopupContent';
import AnotherComponent from './Edit';

async function fetchData() {
  try {
    console.log("开始获取数据...");
    const response = await fetch('https://educations-cf9fc1287fed.herokuapp.com/api/map/education-data');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    console.log("成功获取到数据:", data);
    return data;
  } catch (error) {
    console.error('获取数据时出错:', error);
    throw error; // 可以选择将错误继续抛出以供调用者处理
  }
}

// 调用 fetchData 函数，并处理返回的数据
fetchData()
  .then(data => {
    // 在这里处理获取到的数据
    console.log("在这里处理获取到的数据:", data);
  })
  .catch(error => {
    // 在这里处理错误情况
    console.error("处理获取数据时出错:", error);
  });



const GeoJsonMap = () => {
  const [geoJsonData, setGeoJsonData] = useState(null);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [popupData, setPopupData] = useState(null); 
  const [showAnotherComponent, setShowAnotherComponent] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const geoJsonResponse = await fetch('https://educations-cf9fc1287fed.herokuapp.com/api/map/geoJsonData');
        if (!geoJsonResponse.ok) {
          throw new Error(`HTTP error ${geoJsonResponse.status}`);
        }
        const geoJsonData = await geoJsonResponse.json();
        setGeoJsonData(geoJsonData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
  
    fetchData();
  }, []);

  const onEachFeature = (feature, layer) => {
    layer.on({
      mouseover: () => { 
        layer.setStyle({ fillColor: 'rgba(0, 0, 0, 1)' });
      },
      mouseout: () => { 
        if (feature === selectedFeature) {
          layer.setStyle({ fillColor: 'rgba(0, 0, 0, 1)' });
        } else {
          layer.setStyle({ fillColor: 'rgba(255, 255, 255, 1)' });
        }
      },
      click: () => {
        sendDataToBackend(feature.properties.COUNTYNAME, layer);
      }
    });
  };
  const sendDataToBackend = async (countyName, layer) => {
    try {
      const response = await fetch('https://educations-cf9fc1287fed.herokuapp.com/api/map/data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ countyName }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      const jsonData = await response.json();
      if (jsonData) {
        setPopupData(jsonData);
      }
    } catch (error) {
      console.error('Error sending data to backend:', error);
    }
  };

  function handleButtonClick(data) {
    setPopupData(data); // 更新 PopupContent 的資料
    setShowAnotherComponent(true); // 關閉 AnotherComponent
  };

  function fetchData() {
    async function fetchDataFromServer() {
      try {
        const geoJsonResponse = await fetch('https://educations-cf9fc1287fed.herokuapp.com/api/map/geoJsonData');
        if (!geoJsonResponse.ok) {
          throw new Error(`HTTP error ${geoJsonResponse.status}`);
        }
        const geoJsonData = await geoJsonResponse.json();
        setGeoJsonData(geoJsonData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
  
    fetchDataFromServer();
  }


  const updatePopupContent = (newData) => {
    setPopupData(newData);
  };

  function updateDataInDatabase(updatedData) {
    const { _id, ...dataToUpdate } = updatedData; // 剥离 _id 字段，因为它是数据库中的主键
  
    fetch(`https://educations-cf9fc1287fed.herokuapp.com/api/map/data/${_id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataToUpdate), // 将修改后的数据发送给后端
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}`);
        }
        return response.json(); // 返回JSON响应数据
      })
      .then(updatedData => {
        // 在这里处理更新成功后的逻辑
        console.log('数据更新成功:', updatedData);
        // 可以做一些清理工作或者提示用户更新成功等操作
        fetchData();
      })
      .catch(error => {
        // 在这里处理更新失败后的逻辑
        console.error('数据更新失败:', error);
        // 可以给用户一些错误提示，或者重试更新等操作
      });
  }
  

  return (
    <> 
<MapContainer id="map" center={[23.5, 121]} zoom={7} style={{ zIndex: '0' }}>
      <TileLayer
        url="https://{s}.tile.thunderforest.com/landscape/{z}/{x}/{y}.png?apikey=e9f3580768cc4b7d9f18ee25534a165e"
      />
      {geoJsonData && (
        <GeoJSON
          data={geoJsonData}
          style={() => ({
            fillColor: 'rgba(255, 255, 255, 1)',
            color: 'transparent'
          })}
          onEachFeature={onEachFeature}
        />
      )}
    </MapContainer>
    <div className="data">
    {popupData && (
        <PopupContent  jsonData={popupData}  onButtonClick={handleButtonClick} fetchData={fetchData}/>
      )}
    
      {showAnotherComponent && 
        <AnotherComponent 
        jsonData={popupData} 
        onSave={updateDataInDatabase} 
        onCancel={() => setShowAnotherComponent(false)}
        fetchData={fetchData} 
        onUpdatePopupContent={updatePopupContent}
        />
      }
      </div>
    </>
  );
};

export default GeoJsonMap;
