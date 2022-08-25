import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';


const Signup = (props) => {
    const [credentials, setCredentials] = useState({ email: "", password: "", name: "", cpassword: "" })
    let navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch("http://localhost:4000/api/auth/createuser", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: credentials.email, password: credentials.password, name: credentials.name })
        });
        const json = await response.json()
        console.log(json);
        if (json.success) {
            // Save the auth token and redirect
            localStorage.setItem('token', json.authtoken);

            navigate("/login")
            props.showAlert("Account Created succesfully", 'success')
        }
        else {
            props.showAlert("invalid credentials", 'danger')
        }

    }

    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value })
    }
    return (
        <div className='container'><form onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input type="text" className="form-control" id="name" aria-describedby="emailHelp" name='name' required minLength={3} placeholder="Enter your name" onChange={onChange} />
            </div>
            <div className="form-group">
                <label htmlFor="email">Email address</label>
                <input type="email" className="form-control" id="email" name='email' aria-describedby="emailHelp" onChange={onChange} placeholder="Enter email" required />
                <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
            </div>
            <div className="form-group">
                <label htmlFor="password">Password</label>
                <input type="password" className="form-control" id="password" name='password' placeholder="Password" required minLength={5} onChange={onChange} />
            </div>
            <div className="form-group">
                <label htmlFor="cpassword">Confirm Password</label>
                <input type="password" className="form-control" id="cpassword" name='cpassword' placeholder="Password" required minLength={5} onChange={onChange} />
            </div>

            <button type="submit" className="btn btn-primary">Submit</button>
        </form></div>
    )
}

export default Signup