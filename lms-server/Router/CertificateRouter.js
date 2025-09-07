const router = require("express").Router();
const CertificateController = require("../Controller/Certificate.js");

//postmethods
router.post("/createCertificate", CertificateController.createCertificate);

//deletemetods
router.delete(
  "/deleteCertificate/:id",
  CertificateController.deleteCertificate
);

//getmethods
router.get("/getAllCertificates", CertificateController.getAllCertificates);
router.get(
  "/getCertificate/:certificateId",
  CertificateController.getCertificateById
);
router.get(
  "/getCertificatesByStudent/:studentId",
  CertificateController.getCertificatesByStudent
);

//downloadmethods
router.get("/downloadCertificate/:certificateId", CertificateController.downloadCertificate);

module.exports = router;
