import React, { useState } from 'react';
import './Form.css';
import axios from 'axios'; // Import axios for making HTTP requests

function Form() {
    const [isLoading, setIsLoading] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        reasonForVisit: '',
        description: '',
        address: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await axios.post('http://localhost:5001/bookings', formData);
            console.log('Booking saved:', response.data);
            setIsAnimating(true);
        } catch (error) {
            console.error('Error saving booking:', error.response ? error.response.data : error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="app-container">
            {!isLoading && !isAnimating && (
                <div className="form-container">
                    <form className="form-content" onSubmit={handleSubmit}>
                        <label className="checkbox-wrapper">
                            <input className="checkbox-input" type="checkbox" />
                            <span className="checkbox-text">Already Have an Account?</span>
                        </label>
                        <div className="row">
                            <div className="col">
                                <div className="form-group">
                                    <label htmlFor="firstName">First Name</label>
                                    <input id="firstName" name="firstName" className="form-control" type="text" value={formData.firstName} onChange={handleChange} />
                                </div>
                            </div>
                            <div className="col">
                                <div className="form-group">
                                    <label htmlFor="lastName">Last Name</label>
                                    <input id="lastName" name="lastName" className="form-control" type="text" value={formData.lastName} onChange={handleChange} />
                                </div>
                            </div>
                            <div className="col">
                                <div className="form-group">
                                    <label htmlFor="email">Email</label>
                                    <input id="email" name="email" className="form-control" type="email" value={formData.email} onChange={handleChange} />
                                </div>
                            </div>
                            <div className="col">
                                <div className="form-group">
                                    <label htmlFor="phone">Phone</label>
                                    <input id="phone" name="phone" className="form-control" type="text" value={formData.phone} onChange={handleChange} />
                                </div>
                            </div>
                            <div className="col">
                                <div className="form-group">
                                    <label htmlFor="reasonForVisit">Reason For Visit</label>
                                    <textarea id="reasonForVisit" name="reasonForVisit" className="form-control" rows="3" value={formData.reasonForVisit} onChange={handleChange}></textarea>
                                </div>
                            </div>
                            <div className="col">
                                <div className="form-group">
                                    <label htmlFor="description">Description</label>
                                    <textarea id="description" name="description" className="form-control" rows="3" value={formData.description} onChange={handleChange}></textarea>
                                </div>
                            </div>
                            <div className="col">
                                <div className="form-group">
                                    <label htmlFor="address">Address</label>
                                    <input id="address" name="address" className="form-control" type="text" value={formData.address} onChange={handleChange} />
                                </div>
                            </div>
                        </div>
                        <button className="Next" type="submit">Book</button>
                    </form>
                </div>
            )}
            {isLoading && (
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                </div>
            )}
            {isAnimating && (
                <div className="animation-container">
                    <div className="table center">
                        <div className="monitor-wrapper center">
                            <div className="monitor center">
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Form;
