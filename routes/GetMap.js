const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const fs = require('fs');
const Education = require("../model").education;

// 加载地理数据
const geoJsonData = JSON.parse(fs.readFileSync('../GEO.json', 'utf8'));

router.use((req, res, next) => {
  console.log("正在接收一個跟auth有關的請求");
  next();
});


 router.get('/geoJsonData', (req, res) => {
  // 在这里对 geoJsonData 进行预处理
  const processedGeoJsonData = geoJsonData;
  res.json(processedGeoJsonData);
});

 router.put('/data/:id', async (req, res) => {
  const id = req.params.id; // 获取路由参数中的id
  const newData = req.body; // 获取请求体中的更新数据
  try {
    const updatedData = await Education.findByIdAndUpdate(id, newData, { new: true });

    if (!updatedData) {
      return res.status(404).json({ message: '未找到相应的数据' });
    }

    // 返回更新后的数据
    res.json(updatedData);
  } catch (error) {
    console.error('更新数据时发生错误:', error);
    res.status(500).json({ message: '服务器内部错误，无法更新数据' });
  }
});

router.post('/data', async (req, res) => {
  const { countyName } = req.body;
  try {
    const cityData = await Education.findOne({ '縣市別': countyName }).lean();
    if (!cityData) {
      // 如果没有找到相应的城市数据，则返回适当的响应
      return res.status(404).json({ message: 'City not found' });
    }
    // 找到了城市数据，将其发送回前端
    res.json(cityData);
  } catch (error) {
    // 处理查询过程中的错误
    console.error('Error fetching city data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }

  async function fetchData() {
    try {
      const fetch = await import('node-fetch');
      const response = await fetch.default('https://stats.moe.gov.tw/files/ebook/Education_Statistics/111/111edu_B_1_4.json');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw new Error('Error fetching data');
    }
  }
  
  router.get('/education-data', async (req, res) => {
      try {
        const data = await fetchData();
        for (const record of data) {
          await EducationData.create(record);
        }
        res.json(data);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });
    
});

module.exports = router;
