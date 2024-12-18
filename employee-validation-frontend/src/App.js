import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import  Validator from 'validator';

const App = () => {
    const [formData, setFormData] = useState({
        name: '',
        employeeId: '',
        email: '',
        phone: '',
        department: '',
        dateOfJoining: '',
        role: '',
    });
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validateForm = () => {
        const { name, employeeId, email, phone, department, dateOfJoining, role } = formData;

        if (!name || !employeeId || !email || !phone || !department || !dateOfJoining || !role) {
            setError('All fields are mandatory.');
            return false;
        }

        if (employeeId.length > 10) {
            setError('Employee ID must be a maximum of 10 characters.');
            return false;
        }

        if (!Validator.isEmail(email)) {
            setError('Invalid email address.');
            return false;
        }      

        if (!/^\d{10}$/.test(phone)) {
            setError('Phone number must be 10 digits.');
            return false;
        }

        const today = new Date();
        if (new Date(dateOfJoining) > today) {
            setError('Date of Joining cannot be a future date.');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            setMessage('');
            return;
        }

        setError('');
        try {
            const response = await axios.post('https://fsd-backend-tmk0.onrender.com/add-employee', formData);
            setMessage(response.data);
            setFormData({
                name: '',
                employeeId: '',
                email: '',
                phone: '',
                department: '',
                dateOfJoining: '',
                role: '',
            });
        } catch (err) {
            setError(err.response?.data || 'Error adding employee.');
        }
    };

    return (
        <div className="form-container">
            <h2>Add Employee</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Employee ID:</label>
                    <input
                        type="text"
                        name="employeeId"
                        value={formData.employeeId}
                        onChange={handleChange}
                        maxLength="10"
                        required
                    />
                </div>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Phone Number:</label>
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Department:</label>
                    <select
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Department</option>
                        <option value="HR">HR</option>
                        <option value="Engineering">Engineering</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Sales">Sales</option>
                    </select>
                </div>
                <div>
                    <label>Date of Joining:</label>
                    <input
                        type="date"
                        name="dateOfJoining"
                        value={formData.dateOfJoining}
                        max = {new Date().toISOString().split('T')[0]}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Role:</label>
                    <input
                        type="text"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        required
                    />
                </div>
                {error && <p className="error">{error}</p>}
                {message && <p className="success">{message}</p>}
                <div class="button-container">
                <button type="submit">Submit</button>
                <button type="reset" onClick={() => setFormData({
                    name: '',
                    employeeId: '',
                    email: '',
                    phone: '',
                    department: '',
                    dateOfJoining: '',
                    role: '',
                })}>
                    Reset
                </button>
                </div>
            </form>
        </div>
    );
};

export default App;
 