const mongoose = require("mongoose");
const Request = require("../models/Request.js");
const User = require('../models/users/User.js')
const createRequest = async (req, res) => {
    const { userName, email, password, role } = req.body;
    try {
        if (!userName || !email || !password || !role) {
            return res.status(406).json({ error: 'All fields are required!' });
        }

        // Check unique userName across all users
        const existingUserName = await User.findOne({ userName });
        if (existingUserName) {
            return res.status(400).json({ error: "Username already exists" });
        }

        // Check unique email across all users
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ error: "Email already exists" });
        }

        const existingUserNameRequests = await Request.findOne({
            userName,
            status: { $ne: 'rejected' }
        });
        if (existingUserNameRequests) {
            return res.status(400).json({ error: "Request has been submitted with this username" });
        }

        const existingEmailRequests = await Request.findOne({ email, status: { $ne: 'rejected' } });
        if (existingEmailRequests) {
            return res.status(400).json({ error: "Request has been submitted with this email" });
        }


        const createdRequest = await Request.create({ userName, email, password, role });
        res.status(201).json(createdRequest);
    } catch (error) {
        // Return a 400 response with the error message
        res.status(400).json({ error: error.message });
    }
};


const getRequests = async (req, res) => {
    try {
        const reqs = await Request.find();

        if (reqs.length === 0) {
            return res.status(404).json('No requests found');
        }

        res.status(200).json(reqs);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const deleteRequest = async (req, res) => {
    const { id } = req.params;
    try {
        const req = await Request.findByIdAndDelete(id);

        return res.status(200).json('request deleted successfully')
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}

module.exports = {
    createRequest,
    getRequests,
    deleteRequest
}
