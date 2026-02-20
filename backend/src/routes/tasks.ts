import express, { Response } from 'express';
import { body, validationResult, query } from 'express-validator';
import prisma from '../config/database';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = express.Router();

// All task routes require authentication
router.use(authenticateToken);

// Get all tasks with pagination, filtering, and search
router.get(
  '/',
  [
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
    query('status').optional().isIn(['PENDING', 'IN_PROGRESS', 'COMPLETED']),
    query('search').optional().isString(),
  ],
  async (req: AuthRequest, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const status = req.query.status as string | undefined;
    const search = req.query.search as string | undefined;
    const skip = (page - 1) * limit;

    try {
      const where: any = {
        userId: req.userId!,
      };

      if (status) {
        where.status = status;
      }

      if (search) {
        where.title = {
          contains: search,
          mode: 'insensitive',
        };
      }

      const [tasks, total] = await Promise.all([
        prisma.task.findMany({
          where,
          skip,
          take: limit,
          orderBy: {
            createdAt: 'desc',
          },
        }),
        prisma.task.count({ where }),
      ]);

      res.json({
        tasks,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      console.error('Get tasks error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// Get single task
router.get('/:id', async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  try {
    const task = await prisma.task.findFirst({
      where: {
        id,
        userId: req.userId!,
      },
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create task
router.post(
  '/',
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description').optional().isString(),
    body('status').optional().isIn(['PENDING', 'IN_PROGRESS', 'COMPLETED']),
  ],
  async (req: AuthRequest, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, status } = req.body;

    try {
      const task = await prisma.task.create({
        data: {
          title,
          description,
          status: status || 'PENDING',
          userId: req.userId!,
        },
      });

      res.status(201).json(task);
    } catch (error) {
      console.error('Create task error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// Update task
router.patch(
  '/:id',
  [
    body('title').optional().trim().notEmpty(),
    body('description').optional().isString(),
    body('status').optional().isIn(['PENDING', 'IN_PROGRESS', 'COMPLETED']),
  ],
  async (req: AuthRequest, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { title, description, status } = req.body;

    try {
      // Check if task exists and belongs to user
      const existingTask = await prisma.task.findFirst({
        where: {
          id,
          userId: req.userId!,
        },
      });

      if (!existingTask) {
        return res.status(404).json({ error: 'Task not found' });
      }

      const task = await prisma.task.update({
        where: { id },
        data: {
          ...(title && { title }),
          ...(description !== undefined && { description }),
          ...(status && { status }),
        },
      });

      res.json(task);
    } catch (error) {
      console.error('Update task error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// Delete task
router.delete('/:id', async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  try {
    // Check if task exists and belongs to user
    const existingTask = await prisma.task.findFirst({
      where: {
        id,
        userId: req.userId!,
      },
    });

    if (!existingTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    await prisma.task.delete({
      where: { id },
    });

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Toggle task status
router.patch('/:id/toggle', async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  try {
    // Check if task exists and belongs to user
    const existingTask = await prisma.task.findFirst({
      where: {
        id,
        userId: req.userId!,
      },
    });

    if (!existingTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Toggle status: PENDING -> IN_PROGRESS -> COMPLETED -> PENDING
    let newStatus: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
    if (existingTask.status === 'PENDING') {
      newStatus = 'IN_PROGRESS';
    } else if (existingTask.status === 'IN_PROGRESS') {
      newStatus = 'COMPLETED';
    } else {
      newStatus = 'PENDING';
    }

    const task = await prisma.task.update({
      where: { id },
      data: { status: newStatus },
    });

    res.json(task);
  } catch (error) {
    console.error('Toggle task error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
