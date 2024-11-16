import { Request, Response } from "express";
import dotenv from 'dotenv'
import { UploadedFile } from "express-fileupload";
import AWS from 'aws-sdk'

dotenv.config()

console.log(process.env.AWS_ACCESS_KEY_ID);

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    region: process.env.AWS_REGION ?? 'us-east-1',
    sessionToken:process.env.AWS_SECRET_SESSION_TOKEN!
});

// Configurar AWS S3
const s3 = new AWS.S3();


export const saveFile = async (req: Request, res: Response): Promise<void> => {
    const files = req.files?.file;

    if (files) {
        if (Array.isArray(files)) {
            // Si es un array, recorremos todos los archivos
            files.forEach((file: UploadedFile) => {
                console.log("(files) => ", file.name)
            });
            res.status(200).json({ message: "Archivo subido exitosamente" });
        } else {
            // Si es un solo archivo

            const params = {
                Bucket: 'upchiapas-docs',  // Reemplaza con tu nombre de bucket
                Key: `${Date.now()}_${files.name}`,  // Nombre único del archivo
                Body: files.data,  // El contenido del archivo
                ContentType: files.mimetype,  // Tipo de contenido (mime type)
                //ACL: 'public-read',  // Acceso público
            };

            console.log("Config: "+ s3.config.credentials?.accessKeyId);
            
            try {
                const uploadResult = await s3.upload(params).promise();
                res.status(200).send({
                    message: 'Archivo subido con éxito',
                    fileUrl: uploadResult.Location,  // URL pública del archivo en S3
                });
            } catch (err) {
                console.error('Error subiendo archivo:', err);
                res.status(500).send('Error subiendo el archivo');
            }

            //console.log(files);
            //res.status(200).json({ message: "Archivo subido exitosamente", name: files.name });
        }
    } else {
        res.status(400).send("No se han subido archivos");
    }
}
