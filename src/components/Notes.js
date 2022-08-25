import React, { useContext, useEffect, useRef, useState } from 'react';
import NoteContext from '../context/notes/NoteContext';
import AddNote from './AddNote';
import { useNavigate } from 'react-router-dom';
import NoteItem from './NoteItem';
const Notes = (props) => {
    let navigatorr = useNavigate()
    const context = useContext(NoteContext);
    const { notes, getNotes, editNote } = context
    const [note, setNote,] = useState({ id: "", etitle: "", edescription: "", etag: "" });

    useEffect(() => {
        if (localStorage.getItem('token')) {
            navigatorr("/")
            getNotes()
        } else {
            navigatorr("/login")
        }
        //eslint-disable-next-line
    }, []);
    const updateNote = (currentNote) => {
        ref.current.click()
        setNote({ id: currentNote._id, etitle: currentNote.title, edescription: currentNote.description, etag: currentNote.tag, })

    }
    const ref = useRef(null)
    const refClose = useRef(null)
    const handleClick = (e) => {
        e.preventDefault()
        editNote(note.id, note.etitle, note.edescription, note.etag)
        refClose.current.click()
        props.showAlert("Updated Succesfully", "success")
        console.log(note)
    }
    const onChange = (e) => {
        setNote({ ...note, [e.target.name]: e.target.value })
    }
    return (
        <>
            <AddNote showAlert={props.showAlert} />

            <button type="button" className="btn btn-primary d-none" ref={ref} data-bs-toggle="modal" data-bs-target="#exampleModal">
                Launch demo modal
            </button>
            {/* <!-- Modal --> */}
            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Modal title</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form>
                                <div className="mb-3">
                                    <label htmlFor="etitle" className="form-label">Title</label>
                                    <input type="text" className="form-control" id="etitle" name='etitle' aria-describedby="emailHelp" value={note.etitle} onChange={onChange} />

                                </div>
                                <div className="mb-3">
                                    <label htmlFor="edescription" className="form-label">Description</label>
                                    <input type="text" className="form-control" id="edescription" name='edescription' value={note.edescription} onChange={onChange} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="etag" className="form-label">Tag</label>
                                    <input type="text" className="form-control" id="etag" name='etag' value={note.etag} onChange={onChange} />
                                </div>

                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" ref={refClose} className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" disabled={note.etitle.length < 5 || note.edescription.length < 5 || note.etag.length < 2} className="btn btn-primary" onClick={handleClick}>Update note</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row my-3">

                <h2>your notes</h2>
                {notes.length === 0 && <div className="container">No notes to show</div>}
                {notes.map((note, index) => {
                    return <NoteItem note={note} key={index} showAlert={props.showAlert} updateNote={updateNote} />
                })}
            </div>
        </>
    );
}

export default Notes;
