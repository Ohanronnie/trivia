import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
  Body,
  Get,
  Render,
  UseGuards,
  Req,
  Param,
  Res,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import path, { join } from 'path';
import { UserGuard } from 'src/auth/auth.guard';
import { ContentService } from './content.service';
import { Response } from 'express';
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
@Controller('content')
export class ContentController {
  constructor(private contentService: ContentService) {}
  @Get('create')
  @UseGuards(UserGuard)
  @Render('content/create')
  async create() {}

  @Post('create')
  @UseGuards(UserGuard)
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        {
          name: 'user-image',
        },
        {
          name: 'prize1',
        },
        {
          name: 'prize2',
        },
        {
          name: 'prize3',
        },
      ],
      fileOptions,
    ),
  )
  async uploadFiles(
    @UploadedFiles() files: any,
    @Body() body: any,
    @Req() req: any,
    @Res() res: any
  ) {
    const { prize1, prize2, prize3, 'user-image': image } = files;
    let kFiles: any = {};
    let url = '/';
    const replace = (val) => val;
    console.log(files['user-image'][0])
    if (files['user-image'][0]?.filename) {
      kFiles.image = (url+replace( files['user-image'][0]?.filename));
    }
    for (let val of ['prize1', 'prize2', 'prize3']) {
      if (files[val]) {
        kFiles[val] = (url+replace( files[val][0]?.filename));
      }
    }
    const result = await this.contentService.createContent(req.session.user, {
      ...body,
      ...kFiles,
    });
    if(!result) return;
    return res.redirect(`/content/${result.username}/${result.contentId}`)
   // return { contentId: result && result.contentId, username: result && result.username };
  }
  @Get(':username/:contentId')
  async getContent(
    @Res() res: Response,
    @Param('username') username: string,
    @Param('contentId') contentId: string,
  ) {
    const result = await this.contentService.getContent(username, contentId);
    res.render('content/index', {
      ...result,
    });
  }
}
