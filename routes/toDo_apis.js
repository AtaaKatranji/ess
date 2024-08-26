const express = require("express");

const router = express.Router();

const mongoose = require('mongoose');

const UserModel = require("../models/user.model");
const { ToDoItem, SubTask } = require("../models/schmeaESS");




router.post('/api/todo', async (req, res) => {
    try {
      const newItem = new ToDoItem(req.body);
      const savedItem = await newItem.save();
      res.status(201).json(savedItem);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  //get all tasks
  router.get('/api/todo', async (req, res) => {
    try {
        
      const items = await ToDoItem.find().populate('subTasks');
      res.json(items);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  //get specific employee's tasks 
  router.get('/api/todo/:employeeId', async (req, res) => {

    const { employeeId } = req.params; // Extract employeeId from the request parameters
    console.log(req.params);
    try {
        // Find tasks associated with the specific employee
        const items = await ToDoItem.find({ employeeId }).populate('subTasks');
        
        // Check if any tasks were found
        if (items.length === 0) {
            return res.status(404).json({ message: 'No tasks found for this employee.' });
        }

        res.status(200).json({ message: 'Successfully', items }); // Return the found tasks
    } catch (err) {
        res.status(500).json({ error: err.message }); // Handle any errors
    }
});
  router.put('/api/todo/:id', async (req, res) => {
    try {
      const updatedItem = await ToDoItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!updatedItem) return res.status(404).json({ error: 'ToDoItem not found' });
      res.json(updatedItem);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  
  router.delete('/api/todo/:id', async (req, res) => {
    try {
      const deletedItem = await ToDoItem.findByIdAndDelete(req.params.id);
      if (!deletedItem) return res.status(404).json({ error: 'ToDoItem not found' });
      res.json({ message: 'ToDoItem deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  // API routes for SubTask
  router.post('/api/todo/:todoId/subtask', async (req, res) => {
    try {
      const subTask = new SubTask({ ...req.body, toDoItem: req.params.todoId });
      const savedSubTask = await subTask.save();
      await ToDoItem.findByIdAndUpdate(req.params.todoId, { $push: { subTasks: savedSubTask } });
      res.status(201).json(savedSubTask);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  
  router.put('/api/subtask/:id', async (req, res) => {
    try {
      const updatedSubTask = await SubTask.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!updatedSubTask) return res.status(404).json({ error: 'SubTask not found' });
      res.json(updatedSubTask);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  
  router.delete('/api/subtask/:id', async (req, res) => {
    try {
      const deletedSubTask = await SubTask.findByIdAndDelete(req.params.id);
      if (!deletedSubTask) return res.status(404).json({ error: 'SubTask not found' });
      res.json({ message: 'SubTask deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  module.exports = router;