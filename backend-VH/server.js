const express =require('express');
const cors = require('cors');

const app= express();
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/volunteer-record')
  .then(() => console.log('成功连接到 MongoDB 数据库 (volunteer-record)!'))
  .catch(err => console.error('MongoDB 连接失败:', err));

  const RecordSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  text: {
    type: String,
    required: true
  },
  activity: {
    type: String,
    required: true
  },
  organization: {
    type: String,
    required: true
  },
  hours: {
    type: Number,
    required: true
  },
  Dates: {
    type: [String],
    default: []
  }
});

const Record = mongoose.model('Record', RecordSchema, 'record.list');

//duan kou hao
const port = 8989;

app.use(express.json()); 
app.use(cors()); 


app.get('/api/records', async (req, res) => {
  try {
    const search = (req.query.search || '').trim();

    const query = {};

    if (search) {
      const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

      query.$or = [
        { activity: { $regex: escaped, $options: 'i' } },
        { organization: { $regex: escaped, $options: 'i' } },
        { text: { $regex: escaped, $options: 'i' } }
      ];
    }

    const records = await Record.find(query) //查询所有记录
      .sort({ id: -1 }) //id倒序排列
      .limit(100) //限制返回数量
     

    res.json(records);
  } catch (error) {
    console.error('获取志愿记录失败:', error);
    res.status(500).json({
      message: '获取志愿记录失败'
    });
  }
});

app.listen(port, ()=> {
console.log(`Server running at http://localhost:${port}`);
})