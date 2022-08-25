const express = require('express')
const router = express.Router()
const fetchuser = require('../middleware/fetchuser');
const Notes = require('../models/Note')
const { body, validationResult } = require('express-validator');



//ROUTE-1:Get all the notes "/api/auth/createuser",Does not requie auth
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Notes.find({ user: req.user.id })
        res.json(notes)
    } catch (error) {
        console.error(error.message)
        res.status(500).send("Internal server error")
    }
})

//ROUTE-2:Add a new note "/api/auth/addnote", requie auth
router.post('/addnote', fetchuser, [
    body('title', 'enter a valid title').isLength({ min: 3 }),
    body('description', 'description atleast must be 5 charater').isLength({ min: 5 }),
], async (req, res) => {
    try {
        const { title, description, tag } = req.body
        //i there are error return bad request and error
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const note = new Notes({
            title, description, tag, user: req.user.id
        })
        const savedNotes = await note.save()
        res.json(savedNotes)
    } catch (error) {
        console.error(error.message)
        res.status(500).send("Internal server error")
    }
})
//ROUTE-3:Update an existing note PUT "/api/auth/updatenote", requie auth
router.put('/updatenote/:id', fetchuser, async (req, res) => {
    const { title, description, tag } = req.body;
    try {
        //Create a new object
        const newNote = {};
        if (title) { newNote.title = title }
        if (description) { newNote.description = description }
        if (tag) { newNote.tag = tag }


        //find the note to be updated and update it
        let note = await Notes.findById(req.params.id)
        if (!note) { return res.status(404).send("not found") }
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed")
        }
        note = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
        res.json({ note })
    } catch (error) {
        console.error(error.message)
        res.status(500).send("Internal server error")
    }
})

//ROUTE-4:delete an existing note DELETE "/api/auth/deletenote", requie auth
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    try {
        //find the note to be deleted and delete it
        let note = await Notes.findById(req.params.id)
        if (!note) { return res.status(404).send("not found") }
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed")
        }
        note = await Notes.findByIdAndDelete(req.params.id)
        res.json({ "Success": "NOte HAs been Deleted", note: note })
    } catch (error) {
        console.error(error.message)
        res.status(500).send("Internal server error")

    }
})

module.exports = router