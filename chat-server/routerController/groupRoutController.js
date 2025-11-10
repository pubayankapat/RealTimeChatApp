import express from 'express';
import Group from '../models/groupChat.js';

const createGroup = async (req, res) => {
    try {
        const { groupName, member, createdBy } = req.body;
        const group = Group.find({ groupName });
        if (group) {
            return res.status(500).send({ success: false, message: "Group with the given name already exist" });
        }

        const newGroup = new Group({
            name: groupName,
            members: member,
            createdBy: createdBy
        })

        if (newGroup) {
            await newGroup.save();
            res.status(500).send({ success: false, message: "Group created successfully" })
        } else {
            res.status(500).send({ success: false, message: "Error creating new group" })
        }
    } catch (error) {
        res.status(500).send(
            {
                success: false,
                message: error
            }
        )
    }

}

export default createGroup;