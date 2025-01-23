import React, { useState } from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confPassword, setConfPassword] = useState('');
    const [msg, setMsg] = useState('');
    
    const navigate = useNavigate();  

    const Register = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/users', {
                name,
                email,
                password,
                confPassword
            });
            localStorage.setItem('accessToken', response.data.accessToken);
            navigate("/dashboard");
        } catch (error) {
            if (error.response) {
                setMsg(error.response.data.msg);
            }
        }
    };    

    const axiosJWT = axios.create();

    axiosJWT.interceptors.request.use(
        async (config) => {
            const token = localStorage.getItem('accessToken');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => Promise.reject(error)
    );

    axiosJWT.interceptors.response.use(
        response => response,
        async (error) => {
            if (error.response && error.response.status === 403) {
                const response = await axios.get('http://localhost:5000/token');
                localStorage.setItem('accessToken', response.data.accessToken);
                error.config.headers.Authorization = `Bearer ${response.data.accessToken}`;
                return axios(error.config);
            }
            return Promise.reject(error);
        }
    );    

    return (
        <section className="hero has-background-grey-light is-fullheight is-fullwidth">
            <div className="hero-body">
                <div className="container">
                    <div className="columns is-centered">
                        <div className="column is-4-desktop">
                            <form onSubmit={Register} className="box">
                                <p className="has-text-centered">{msg}</p>
                                <div className="field mt-5">
                                    <label className="label">Name</label>
                                    <div className="controls">
                                        <input 
                                          type="text" 
                                          className="input" 
                                          placeholder="Name"
                                          value={name} 
                                          onChange={(e) => setName(e.target.value)} 
                                        />
                                    </div>
                                </div>
                                <div className="field mt-5">
                                    <label className="label">Email</label>
                                    <div className="controls">
                                        <input 
                                          type="text" 
                                          className="input" 
                                          placeholder="Email" 
                                          value={email} 
                                          onChange={(e) => setEmail(e.target.value)} 
                                        />
                                    </div>
                                </div>
                                <div className="field mt-5">
                                    <label className="label">Password</label>
                                    <div className="controls">
                                        <input 
                                          type="password" 
                                          className="input" 
                                          placeholder="******" 
                                          value={password} 
                                          onChange={(e) => setPassword(e.target.value)} 
                                        />
                                    </div>
                                </div>
                                <div className="field mt-5">
                                    <label className="label">Confirm Password</label>
                                    <div className="controls">
                                        <input 
                                          type="password" 
                                          className="input" 
                                          placeholder="******" 
                                          value={confPassword} 
                                          onChange={(e) => setConfPassword(e.target.value)} 
                                        />
                                    </div>
                                </div>
                                <div className="field mt-5">
                                    <button className="button is-success is-fullwidth">Register</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Register;