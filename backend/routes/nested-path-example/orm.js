import DbRow from "../../db/models/DbRow.js";
import { Router } from "express";
import asyncHandler from "express-async-handler";

const router = Router();

// example with Sequelize ORM
// http://0.0.0.0:8000/nested-path-example/orm-1
// http://0.0.0.0:8000/nested-path-example/orm-2
router.get(
  "/orm-:rowId",
  asyncHandler(async (req, res) => {
    const { rowId } = req.params;

    const allRows = await DbRow.findAll();
    const specificRow = await DbRow.findByPk(rowId);

    if (!specificRow) {
      throw new Error(`Requested row does not exist: ${rowId}`);
    }

    res.json({ rowId, specificRow, numRows: allRows.length });
  }),
);

export default router;
