import { Injectable } from '@nestjs/common';
import * as uuid from 'uuid';

@Injectable()
export class FilesService {
  createFile(file) {
    console.log('We have got a file:', file);
    const fileName = uuid.v4();
  }
}
