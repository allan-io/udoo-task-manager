const mongoose = require('mongoose')

// similar to MongoClient.connect, pass is url, options object
mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api', {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
})