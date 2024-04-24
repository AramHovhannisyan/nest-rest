import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { ValidationException } from 'src/exceptions/validation.exception';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    // if (!metatype || !this.toValidate(metatype)) {
    //   return value;
    // }
    const object = plainToInstance(metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) {
      console.log('errors:', errors);
      const errorsFormatted = errors.map(
        (err) => `${err.property} - ${Object.values(err.constraints)}`,
      );
      throw new ValidationException(errorsFormatted);
    }
    return value;
  }
}
