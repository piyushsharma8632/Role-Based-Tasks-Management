const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticate } = require('../middleware/auth');
const prisma = new PrismaClient();

const router = express.Router();

// Dashboard: Get tasks for logged in user
router.get('/dashboard', authenticate, async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      include: {
        project: { select: { id: true, name: true } }
      },
      orderBy: { dueDate: 'asc' }
    });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Create a task for a project
router.post('/project/:projectId', authenticate, async (req, res) => {
  const { title, description, status, dueDate, assigneeId } = req.body;
  const projectId = Number(req.params.projectId);

  try {
    const task = await prisma.task.create({
      data: {
        title,
        description,
        status: status || 'TODO',
        dueDate: dueDate ? new Date(dueDate) : null,
        projectId,
        assigneeId: assigneeId ? Number(assigneeId) : null
      }
    });
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update a task
router.put('/:id', authenticate, async (req, res) => {
  const { title, description, status, dueDate, assigneeId } = req.body;
  try {
    const existingTask = await prisma.task.findUnique({
      where: { id: Number(req.params.id) }
    });

    if (!existingTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const userRole = (req.user.role || '').toUpperCase();
    // Allow if user is ADMIN, OR if the task is currently assigned to them
    if (userRole !== 'ADMIN' && existingTask.assigneeId != req.user.id) {
      return res.status(403).json({ error: 'Forbidden: You can only update your own tasks' });
    }

    const task = await prisma.task.update({
      where: { id: Number(req.params.id) },
      data: {
        title,
        description,
        status,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        assigneeId: assigneeId ? Number(assigneeId) : null
      }
    });
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete a task
router.delete('/:id', authenticate, async (req, res) => {
  try {
    await prisma.task.delete({
      where: { id: Number(req.params.id) }
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
