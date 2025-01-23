/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate, useParams } from "react-router-dom";

const UpdateUser = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [token, setToken] = useState("");
    const [expire, setExpire] = useState("");
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        refreshToken();
        getUserById();
    }, []);

    const refreshToken = async () => {
        try {
            const response = await axios.get("http://localhost:5000/token");
            setToken(response.data.accessToken);
            const decoded = jwtDecode(response.data.accessToken);
            setExpire(decoded.exp);
        } catch (error) {
            if (error.response) {
                navigate("/");
            }
        }
    };

    const axiosJWT = axios.create();

    axiosJWT.interceptors.request.use(
        async (config) => {
            const currentDate = new Date();
            if (expire * 1000 < currentDate.getTime()) {
                const response = await axios.get("http://localhost:5000/token");
                config.headers.Authorization = `Bearer ${response.data.accessToken}`;
                setToken(response.data.accessToken);
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    const getUserById = async () => {
        try {
            const response = await axiosJWT.get(`http://localhost:5000/users/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setName(response.data.name);
            setEmail(response.data.email);
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };
    
    const updateUser = async (e) => {
        e.preventDefault();
        try {
            await axiosJWT.put(
                `http://localhost:5000/users/${id}`,
                {
                    name,
                    email,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            navigate("/dashboard");
        } catch (error) {
            console.error("Error updating user:", error);
        }
    };    

    return (
        <div className="container mt-5">
            <form onSubmit={updateUser}>
                <div className="field">
                    <label className="label">Name</label>
                    <div className="control">
                        <input
                            type="text"
                            className="input"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Name"
                            required
                        />
                    </div>
                </div>
                <div className="field">
                    <label className="label">Email</label>
                    <div className="control">
                        <input
                            type="email"
                            className="input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                            required
                        />
                    </div>
                </div>
                <div className="field">
                    <button type="submit" className="button is-success">
                        Update
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UpdateUser;
