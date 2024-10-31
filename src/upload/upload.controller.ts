import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import path from 'path';
const fileOptions = {
  storage: diskStorage({
    destination: './uploads',
    filename: (req, file, callback) => {
      const uniqueName = `${Date.now()}-${file.originalname}`;
      callback(null, uniqueName);
    },
  }),
  fileFilter: (req, file, callback) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
      return callback(new Error('Only images are allowed'), false);
    }
    callback(null, true);
  },
};
@Controller('upload')
export class UploadController {
  @Post('files')
  @UseInterceptors(FileFieldsInterceptor([{ name: '' }], fileOptions))
  async uploadFiles(@UploadedFiles() files: File[]) {
    const fileUrls = files;
    console.log(files);
  }
}
