import connectDB from "../../../utils/db";
import Ad from "../../../models/ad";
// const multer  = require('multer');
// import cloudinary from "../../../utils/cloudinary";
// const storage = multer.memoryStorage();

// Disable default body parsing
// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

// // Setup storage
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, "uploads/"),
//   filename: (req, file, cb) => {
//     const ext = path.extname(file.originalname);
//     cb(null, `${uuidv4()}${ext}`);
//   },
// });

// const upload = multer({
//   storage,
//   fileFilter: (req, file, cb) => {
//     file.mimetype === "video/mp4"
//       ? cb(null, true)
//       : cb(new Error("Only .mp4 videos are allowed!"));
//   },
// }).array("videos", 10); // Accept multiple files

// function runMiddleware(req, res, fn) {
//   return new Promise((resolve, reject) => {
//     fn(req, res, (result) => {
//       if (result instanceof Error) reject(result);
//       else resolve(result);
//     });
//   });
// };

// const uploadToCloudinary = (fileBuffer) => {
//   return new Promise((resolve, reject) => {
//     const stream = cloudinary.uploader.upload_stream(
//       { resource_type: "video" },
//       (error, result) => {
//         if (error) reject(error);
//         else resolve(result);
//       }
//     );
//     stream.end(fileBuffer);
//   });
// };

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ message: "Method Not Allowed" });

  await connectDB();

  try {
    // await runMiddleware(req, res, upload);
    const { location, video, cloudinary_id_vid } = req.body;

    console.log(location);

    // const uploadedVideos = [];
    // const cloudinary_id_vid = [];

    // for (const file of req.files) {
    //   // const result = await cloudinary.uploader.upload(file.path, {
    //   //   resource_type: "video",
    //   // });
    //   const result = await uploadToCloudinary(file.buffer);
    //   uploadedVideos.push(result.secure_url);
    //   cloudinary_id_vid.push(result.public_id);
    // }

    const ad = new Ad({ location: location, video: video, cloudinary_id_vid: cloudinary_id_vid }); 
    await ad.save();

    return res.status(201).json(ad);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Upload error", error: error.message });
  }
}

// const files=[];
// const fileInArray=[];

// // Disable body parsing
// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

// const storage = multer.diskStorage({
//     destination:(req, file, cb)=>{
//       cb(null, "uploads/");
//     },
//     filename : (req,file,cb)=>{
//       let filePath = [];
//       const ext = path.extname(file.originalname);
//       const id = uuid();
//       filePath = `${id}${ext}`;
//       fileInArray.push([(filePath)])       
//       files.push(fileInArray)
//       cb(null, filePath)       
//   }
// });


// const upload = multer({
    
//     fileFilter: (req, file, cb) => {
//         if (file.mimetype == "video/mp4") {
//             cb(null, true);
//         } else {
//             cb(null, false);
//             return cb(new Error('Only .mp4 format allowed!'));
//         }
//         },
//     storage,
// }).array("videos", 5);

// function runMiddleware(req, res, fn) {
//   return new Promise((resolve, reject) => {
//     fn(req, res, (result) => {
//       if (result instanceof Error) reject(result);
//       else resolve(result);
//     });
//   });
// }
  
// export default async function handler(req, res) {

//   if (req.method === "POST") {
//     await connectDB();

//     try {
//       await runMiddleware(req, res, upload);

//       const { location } = req.body;
//       let vid;
//       for(let i=0;i<fileInArray.length;i++){
//         vid = await cloudinary.uploader.upload(`${path.resolve(__dirname, "../uploads")}/${fileInArray[i][0]}`,{ resource_type: "video" });
//       }
//       const ad = new Ad({ location, video });
//       await ad.save();

//       res.status(201).json(ad);
//     } catch (error) {
//       res.status(500).json({ message: "Error signing up user" });
//     }
//   } else {
//     res.status(405).json({ message: "Method Not Allowed" });
//   }
// }

// router.post("/", upload.array('uploaded_Image', 10), async (req, res) => {
//   try {
 
//     console.log(req.files.length)
//      console.log("Files",fileInArray)
//      let img;
//      let vid;
//      let pdff;
 
//    for(let i=0;i<fileInArray.length;i++){
//      let fileext = fileInArray[i][0].split('.')[1];
//      console.log(path.resolve(__dirname, "../uploads"))
//      if(fileext=='jpg' || fileext=='png' || fileext=='jpeg')
//      img = await cloudinary.uploader.upload(`${path.resolve(__dirname, "../uploads")}/${fileInArray[i][0]}`);
//      else if(fileext=="mp4")
//      vid = await cloudinary.uploader.upload(`${path.resolve(__dirname, "../uploads")}/${fileInArray[i][0]}`,{ resource_type: "video" });
//      else if(fileext=="pdf")
//      pdff = await cloudinary.uploader.upload(`${path.resolve(__dirname, "../uploads")}/${fileInArray[i][0]}`,{ pages: true });
//    }
 
//     let user = new User({
//       name: req.body.name,
//       avatar: img.secure_url,
//       video : vid.secure_url,
//       pdf : pdff.secure_url,
//       cloudinary_id_img: img.public_id,
//       cloudinary_id_vid: vid.public_id,
//       cloudinary_id_pdf: pdff.public_id,
//     });
    
//     await user.save();
//     res.json(user);
//   } catch (err) {
//     console.log(err);
//   }
// });


