/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const [, setName] = useState('');
    const [token, setToken] = useState('');
    const [expire, setExpire] = useState('');
    const [users, setUsers] = useState([]);
    
    const navigate = useNavigate();  

useEffect(() => {
        refreshToken();
        getUsers();
    }, []);

    const refreshToken = async () => {
        try {
            const response = await axios.get('http://localhost:5000/token');
            setToken(response.data.accessToken);
            const decoded = jwtDecode(response.data.accessToken);
            setName(decoded.name);
            setExpire(decoded.exp);
        } catch (error) {
            if (error.response) {
                navigate("/");  
            }
        }
    }

    const axiosJWT = axios.create();

    axiosJWT.interceptors.request.use(async (config) => {
        const currentDate = new Date();
        if (expire * 1000 < currentDate.getTime()) {
            const response = await axios.get('http://localhost:5000/token');
            config.headers.Authorization = `Bearer ${response.data.accessToken}`;
            setToken(response.data.accessToken);
            const decoded = jwtDecode(response.data.accessToken);
            setName(decoded.name);
            setExpire(decoded.exp);
        }
        return config;
    }, (error) => {
        return Promise.reject(error);
    });

    const getUsers = async () => {
        const response = await axiosJWT.get('http://localhost:5000/users', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        setUsers(response.data);
    }

    const handleCreate = () => {
        navigate("/create");
    }

    const handleUpdate = (id) => {
        navigate(`/Update/${id}`);
    }
    
    const handleDelete = async (id) => {
        try {
            await axiosJWT.delete(`http://localhost:5000/users/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            getUsers();
        } catch (error) {
            console.error('Failed to delete user:', error);
        }
    }

    return (
        <div className="container mt-5">
            <div className="is-flex is-justify-content-space-between mb-3">
                <button className="button is-success" onClick={handleCreate} style={{ paddingLeft: "3em", paddingRight: "3em" }}>
                    Create
                </button>
            </div>
            <table className="table is-striped is-fullwidth">
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user, index) => (
                        <tr key={user.id}>
                            <td>{index + 1}</td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>
                                <button
                                    className="button is-info is-small mr-2"
                                    onClick={() => handleUpdate(user.id)}
                                >
                                <span>Update</span>
                                </button>
                                <button
                                    className="button is-danger is-small"
                                    onClick={() => handleDelete(user.id)}
                                >
                                <span>Delete</span>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Dashboard;