require('../src/db/mongoose')
const User = require('../src/models/user')

const updateAgeAndCount = async (id, age) => {
    const user = await User.findByIdAndUpdate(id, { age })
    const count = await User.countDocuments({ age })
    return count
}

updateAgeAndCount('5ff8eaaf137e6a43ae4478c3', 1 )
    .then(c => console.log(c))
    .catch(e => console.log(e))