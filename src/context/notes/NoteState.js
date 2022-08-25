import React, { useState } from 'react'
import NoteContext from './NoteContext'

const NoteState = (props) => {
    const host = 'http://localhost:4000'
    const notesInitial = []
    const [notes, setNotes] = useState(notesInitial);
    //get all notes

    const getNotes = async () => {
        const response = await fetch(`${host}/api/notes/fetchallnotes`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjMwMzVhZjAxYTY0ZTNkYmVmYWU1MGQ5In0sImlhdCI6MTY2MTE2NDQ0N30.qSbjDiVkbJBl1f2olPD0NLjTK3X1aZMl9Glks4KPS8E'
            },
        });
        const json = await response.json()
        console.log(json)
        setNotes(json)
    }
    // Add a Note
    const addNote = async (title, description, tag) => {
        // TODO: API Call
        // API Call 
        const response = await fetch(`${host}/api/notes/addnote`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjMwMzVhZjAxYTY0ZTNkYmVmYWU1MGQ5In0sImlhdCI6MTY2MTE2NDQ0N30.qSbjDiVkbJBl1f2olPD0NLjTK3X1aZMl9Glks4KPS8E'
            },
            body: JSON.stringify({ title, description, tag })
        });

        const note = await response.json();
        console.log(note)
        // const note = {
        //     '_id': '61322f119553781a8ca8d0e08',
        //     'user': '6131dc5e3e4037cd4734a0664',
        //     'title': title,
        //     'description': description,
        //     'tag': tag,
        //     'date': '2021-09-03T14:20:09.668Z',
        //     '__v': 0
        // };
        setNotes(notes.concat(note))
    }
    //Delete Note
    const deleteNote = async (id) => {

        const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjMwMzVhZjAxYTY0ZTNkYmVmYWU1MGQ5In0sImlhdCI6MTY2MTE2NDQ0N30.qSbjDiVkbJBl1f2olPD0NLjTK3X1aZMl9Glks4KPS8E'
            }
        });
        console.log('delete the note' + id)
        const newNotes = notes.filter((note) => { return note._id !== id })
        setNotes(newNotes)
        console.log(response)
    }
    //Edit Notte
    const editNote = async (id, title, description, tag) => {
        const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjMwMzVhZjAxYTY0ZTNkYmVmYWU1MGQ5In0sImlhdCI6MTY2MTE2NDQ0N30.qSbjDiVkbJBl1f2olPD0NLjTK3X1aZMl9Glks4KPS8E'
            },
            body: JSON.stringify({ id, title, description, tag })
        });

        const json = await response.json();
        console.log(json)
        let newNotes = JSON.parse(JSON.stringify(notes))
        for (let index = 0; index < newNotes.length; index++) {
            const element = newNotes[index];
            if (element._id === id) {
                newNotes[index].title = title
                // newNotes[index] = id
                newNotes[index].description = description
                newNotes[index].tag = tag
                break
            }

        }
        console.log(newNotes)
        setNotes(newNotes)

    }
    return (
        <NoteContext.Provider value={{ notes, addNote, deleteNote, editNote, getNotes }} >
            {props.children}
        </NoteContext.Provider >)
}
export default NoteState