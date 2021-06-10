const express = require('express'),
      mongoose = require('mongoose'),
      cookieParser = require('cookie-parser');

      account = require('./routes/account'),
      chef = require('./routes/chef'),
    
      app = express(),
      port = process.env.PORT || 8090;

// min atributes needed to connect to mongo atlas
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/personal-chef-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
  dbName: 'personal-chef-app'
});

const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to mongo'));

app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser())

app.use('/api', account)
app.use('/api', chef)

app.listen(port, () => {
    console.log('Server Started');
})
