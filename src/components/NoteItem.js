import React, { useContext } from 'react'
import NoteContext from '../context/notes/NoteContext';
function NoteItem(props) {
    const context = useContext(NoteContext);
    const { deleteNote } = context
    const { note, updateNote } = props
    return (
        <div className='col-md-3 '>

            <div className="card my-3">

                <div className="card-body">
                    <h5 className="card-title">{note.title}</h5>
                    <p className="card-text">{note.description}</p>

                    <button onClick={() => updateNote(note)}><i className="far fa-edit mx-2" ></i></button>

                    <button onClick={() => deleteNote(note._id)}> <i className="far fa-trash-alt mx-2" ></i></button>
                </div>
            </div>
        </div>
    )
}

export default NoteItem