const mongoose = require("mongoose");
const { Schema } = mongoose;

const educationSchema = new Schema({
  學年度: Number,
  縣市別: String,
  幼兒園: Number,
  國小: Number,
  國中: Number,
  '高級中等學校-普通科': Number,
  '高級中等學校-專業群科': Number,
  '高級中等學校-綜合高中': Number,
  '高級中等學校-實用技能學程': Number,
  '高級中等學校-進修部': Number,
  '大專校院(全部計入校本部)': Number,
  '大專校院(跨縣市教學計入所在地縣市)': Number,
  '宗教研修學院': Number,
  '國民補習及大專進修學校及空大': Number,
  '特殊教育學校': Number
});

module.exports = mongoose.model('EducationData', educationSchema);
