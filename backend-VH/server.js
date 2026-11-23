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
    default: ''
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
  date: {
    type: [String],
    required: true,
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

app.post('/api/records', async (req, res) => {
  try {
    const lastRecord = await Record.findOne().sort({ id: -1 });
    const nextId = lastRecord && lastRecord.id ? lastRecord.id + 1 : 1;
    // 自动生成id
    console.log('POST BODY:', req.body);
    const record = new Record({
      ...req.body,
      id: nextId
    });

    await record.save();
    res.status(201).json(record);
  } 
  catch (error) {
    console.error('创建志愿记录失败:', error);

    res.status(500).json({
      message: '创建志愿记录失败'
    });
  }
});


app.patch('/api/records/:id', async (req, res) => {
  console.log('收到前端修改请求ID:', req.params.id, '数据:', req.body);
  try {
    const RecordId = Number(req.params.id);

    const record = await Record.findOneAndUpdate(
      { id: RecordId },
      {
        text: req.body.text,
        activity: req.body.activity,
        organization: req.body.organization,
        hours: req.body.hours,
        date: req.body.date
      },
      { returnDocument: 'after',}
    );

    if (!record) {
      return res.status(404).json({
        message: 'Record not found'
      });
    }

    res.json(record);

  } catch (error) {
    console.error('修改失败:', error)
    res.status(500).json({
      message: '修改失败',
      error: error.message
    });
  }
});




app.listen(port, ()=> {
console.log(`Server running at http://localhost:${port}`);
})