import { Injectable } from '@nestjs/common';
import 'multer';
import { UploadApiResponse, UploadApiErrorResponse, v2 as cloudinary } from 'cloudinary';
import toStream = require('streamifier');

@Injectable()
export class CloudinaryService {
    async uploadImage(
        file: Express.Multer.File,
    ): Promise<UploadApiResponse | UploadApiErrorResponse> {
        return new Promise((resolve, reject) => {
            console.log('Uploading to Cloudinary. Mime:', file.mimetype, 'Size:', file.size);

            // Explicitly set resource_type based on mime type
            // Cloudinary treats audio as 'video' resource type
            // Use 'raw' for non-media files (PDFs, Docs) to ensure they are downloadable
            let resourceType: 'auto' | 'image' | 'video' | 'raw' = 'auto';
            if (file.mimetype.startsWith('audio/') || file.mimetype.startsWith('video/')) {
                resourceType = 'video';
            } else if (file.mimetype.startsWith('image/')) {
                resourceType = 'image';
            } else {
                resourceType = 'raw';
            }

            console.log(`Uploading with resource_type: ${resourceType}`);

            const upload = cloudinary.uploader.upload_stream(
                {
                    resource_type: resourceType,
                    folder: 'chat_uploads'
                },
                (error, result) => {
                    if (error) {
                        console.error('Cloudinary Upload Error:', error);
                        return reject(error);
                    }
                    resolve(result!);
                },
            );

            toStream.createReadStream(file.buffer).pipe(upload);
        });
    }
}
