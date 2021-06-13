import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface ClassType<T> {
  new (): T;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor {
  constructor(private readonly classType: ClassType<T>) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<T> {
    return next
      .handle()
      .pipe(map((data) => plainToClass(this.classType, data)));
  }
}
