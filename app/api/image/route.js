import multer from "multer";

export const config = {
  api: {
    bodyParser: false,
  },
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

export async function POST(req, res) {
  console.log("🔗🔗🔗", req.body, req.file);

  return;
  upload.single("file")(req, res, (err) => {
    if (err) {
      console.error(err);
      res.status(500).send("An error occurred while uploading the file.");
    } else {
      const { file } = req;
      const filePath = file.path;

      console.log(filePath, file, "🔗🔗🔗");
      return;

      res.status(200).send("File uploaded successfully.");
    }
  });
}
