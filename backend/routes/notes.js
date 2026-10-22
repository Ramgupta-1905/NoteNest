const express = require('express');
const router = express.Router();
const pool = require('../db/database');

// GET /api/notes - Fetch active notes or Trash
router.get('/', async (req, res) => {
  try {
    const view = req.query.view === 'trash' ? 'trash' : 'active';

    const result = await pool.query(
      `SELECT
        id,
        title,
        content,
        color,
        is_favorite AS "isFavorite",
        is_deleted AS "isDeleted",
        created_at AS "createdAt",
        updated_at AS "updatedAt"
       FROM notes
       WHERE is_deleted = $1
       ORDER BY created_at DESC`,
      [view === 'trash']
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching notes:', error.message);

    res.status(500).json({
      message: 'Failed to fetch notes.',
    });
  }
});

// POST /api/notes - Create a new note
router.post('/', async (req, res) => {
  try {
    const { title, content, color, isFavorite } = req.body;

    if (
      typeof title !== 'string' ||
      !title.trim() ||
      typeof content !== 'string' ||
      !content.trim()
    ) {
      return res.status(400).json({
        message: 'Title and content are required.',
      });
    }

    const result = await pool.query(
      `INSERT INTO notes (title, content, color, is_favorite)
       VALUES ($1, $2, $3, $4)
       RETURNING
         id,
         title,
         content,
         color,
         is_favorite AS "isFavorite",
         created_at AS "createdAt",
         updated_at AS "updatedAt"`,
      [
        title.trim(),
        content.trim(),
        color || 'blue',
        isFavorite ?? false,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating note:', error.message);

    res.status(500).json({
      message: 'Failed to create note.',
    });
  }
});

// PUT /api/notes/:id - Update an existing note
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, color, isFavorite } = req.body;

    if (
      typeof title !== 'string' ||
      !title.trim() ||
      typeof content !== 'string' ||
      !content.trim()
    ) {
      return res.status(400).json({
        message: 'Title and content are required.',
      });
    }

    const result = await pool.query(
      `UPDATE notes
       SET title = $1,
           content = $2,
           color = $3,
           is_favorite = $4,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $5
       RETURNING
         id,
         title,
         content,
         color,
         is_favorite AS "isFavorite",
         created_at AS "createdAt",
         updated_at AS "updatedAt"`,
      [
        title.trim(),
        content.trim(),
        color || 'blue',
        isFavorite ?? false,
        id,
      ]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        message: 'Note not found.',
      });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error updating note:', error.message);

    res.status(500).json({
      message: 'Failed to update note.',
    });
  }
});


// DELETE /api/notes/trash - Permanently delete all notes in Trash
router.delete('/trash', async (req, res) => {
  try {
    const result = await pool.query(
      `DELETE FROM notes
       WHERE is_deleted = TRUE
       RETURNING id`
    );

    res.status(200).json({
      message: 'Trash cleared successfully.',
      deletedCount: result.rowCount,
    });
  } catch (error) {
    console.error('Error clearing Trash:', error.message);

    res.status(500).json({
      message: 'Failed to clear Trash.',
    });
  }
});


// DELETE /api/notes/:id - Move a note to Trash
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `UPDATE notes
       SET is_deleted = TRUE,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $1
         AND is_deleted = FALSE
       RETURNING
         id,
         title,
         content,
         color,
         is_favorite AS "isFavorite",
         is_deleted AS "isDeleted",
         created_at AS "createdAt",
         updated_at AS "updatedAt"`,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        message: 'Active note not found.',
      });
    }

    res.status(200).json({
      message: 'Note moved to Trash.',
      note: result.rows[0],
    });
  } catch (error) {
    console.error('Error moving note to Trash:', error.message);

    res.status(500).json({
      message: 'Failed to move note to Trash.',
    });
  }
});

// PATCH /api/notes/:id/restore - Restore a note from Trash
router.patch('/:id/restore', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `UPDATE notes
       SET is_deleted = FALSE,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $1
         AND is_deleted = TRUE
       RETURNING
         id,
         title,
         content,
         color,
         is_favorite AS "isFavorite",
         is_deleted AS "isDeleted",
         created_at AS "createdAt",
         updated_at AS "updatedAt"`,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        message: 'Note not found in Trash.',
      });
    }

    res.status(200).json({
      message: 'Note restored successfully.',
      note: result.rows[0],
    });
  } catch (error) {
    console.error('Error restoring note:', error.message);

    res.status(500).json({
      message: 'Failed to restore note.',
    });
  }
});

// DELETE /api/notes/:id/permanent - Permanently delete a note from Trash
router.delete('/:id/permanent', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `DELETE FROM notes
       WHERE id = $1
         AND is_deleted = TRUE
       RETURNING id, title`,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        message: 'Note not found in Trash.',
      });
    }

    res.status(200).json({
      message: 'Note permanently deleted.',
      note: result.rows[0],
    });
  } catch (error) {
    console.error('Error permanently deleting note:', error.message);

    res.status(500).json({
      message: 'Failed to permanently delete note.',
    });
  }
});

module.exports = router;