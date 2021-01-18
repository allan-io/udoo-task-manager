const express = require('express')
const router = new express.Router()
const Task = require('../models/task')
const auth = require('../middleware/auth')


// GET /tasks?completed=false
// GET /tasks?limit=10&skip=0
// GET /tasks/?sortBy=createdAt_asc
router.get('/tasks', auth, async (req, res) => {
    const match = {}
    const sort = {}
     
    if (req.query.completed) {
        match.completed = req.query.completed === 'true'
    }

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }

    try {

        // populates user with tasks that complt to match: property
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            },
            // match: {
            //     completed: false
            // }
        }).execPopulate()
        
        if (req.user.tasks.length === 0) return res.send('No tasks available')
        res.status(201).send(req.user.tasks)
    } catch (e) {
        console.log(e)
    }
})

router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id

    try {
        const task = await Task.find({ _id, owner: req.user._id })

        if (!task) return res.status(404).send('Task not found')
        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
})

router.post('/tasks', auth, async (req, res) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })

    try {
        await task.save()
        res.status(201).send(task)
    } catch (e) {
        res.status(500).send()
    }
})

router.patch('/tasks/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every(el => allowedUpdates.includes(el))

    if (!isValidOperation) return res.status(400).send({ error: 'Invalid task update' })

    try {
        const task = await Task.findOne( { owner: req.user._id, _id: req.params.id})
        if (!task) res.status(404).send()
        
        updates.forEach(update => task[update] = req.body[update])
        await task.save()
        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
})

router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id })

        if (!task) return res.status(404).send()

        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router