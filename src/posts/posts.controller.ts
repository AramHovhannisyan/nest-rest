import {
  Body,
  Controller,
  Get,
  HttpStatus,
  ParseFilePipeBuilder,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { Roles } from 'src/roles/roles.decorator';
import { RolesGuard } from 'src/roles/roles.guard';
import { CreatePostDto } from './dto/create-post-dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @Get()
  getAllPosts() {
    return this.postsService.getAll();
  }

  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './src/static',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now();
          const extName = extname(file.originalname);
          const fileName = uniqueSuffix + extName;

          callback(null, fileName);
        },
      }),
    }),
  )
  @Post()
  async createPost(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: 'jpeg',
        })
        .addMaxSizeValidator({
          maxSize: 100000000,
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    image: Express.Multer.File,
    @Body() dto: CreatePostDto,
  ) {
    return await this.postsService.createOne({ ...dto }, image.filename);
  }
}
