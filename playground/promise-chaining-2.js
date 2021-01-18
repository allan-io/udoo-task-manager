require('../src/db/mongoose')
const Task = require('../src/models/task')

// Task.findByIdAndDelete('5ff8e8786c4ed242a340c869')
//     .then(result => {
//         return Task.countDocuments({ completed: false })
//     })
//     .then(count => console.log(count))
//     .catch(e => console.log(e))


const deleteTaskAndCount = async (id) => {
    await Task.findByIdAndDelete(id)
    const count = await Task.countDocuments({completed: false})
    return count
}

deleteTaskAndCount('5ff8e8d533ecc7435e1b95e5')
    .then(c => console.log(c))
    .catch(e => console.log(e))

