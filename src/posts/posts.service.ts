import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Post } from './posts.model';
import { CreatePostDto } from './dto/create-post-dto';
import { FilesService } from 'src/files/files.service';
import { MulterModule } from '@nestjs/platform-express';

const multerxxx = MulterModule.register({
  dest: './../static',
});

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post) private postModel: typeof Post,
    private readonly fileService: FilesService,
  ) {}

  async createOne(dto: CreatePostDto, image) {
    try {
      const postData = {
        ...dto,
        image,
      };

      const post = await this.postModel.create(postData);

      return post;
    } catch (error) {
      console.log(error);
      return {
        message: 'Cant Create Post',
      };
    }
  }

  getAll() {
    return [
      {
        id: 1,
        name: 'Name 1',
      },
    ];
  }
}
