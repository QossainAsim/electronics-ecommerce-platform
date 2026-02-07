const express = require("express");
const router = express.Router();

const {
  uploadCsvAndCreateBatch,
  listBatches,
  getBatchDetail,
  updateBatchItems,
  deleteBatch,
  downloadTemplate,
} = require("../controllers/bulkUpload");

// Main bulk upload routes
router.route("/")
  .post(uploadCsvAndCreateBatch)
  .get(listBatches);

// Template download route
router.get("/template", downloadTemplate);

// Batch-specific routes
router.route("/:batchId")
  .get(getBatchDetail)
  .put(updateBatchItems)
  .delete(deleteBatch);

module.exports = router;