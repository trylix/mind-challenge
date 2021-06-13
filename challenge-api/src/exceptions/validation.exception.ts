import { HttpException, HttpStatus } from '@nestjs/common';
import { ValidationError } from 'class-validator';

interface ValidationFieldError {
  message: string;
  field: string;
}

export class ValidationException extends HttpException {
  constructor(
    private readonly errors: ValidationError[] | ValidationFieldError,
  ) {
    super('', HttpStatus.UNPROCESSABLE_ENTITY);

    if (!Array.isArray(errors)) {
      this.message = errors.message;
    }
  }

  private makeBody(errors: ValidationError[]) {
    const result = {};
    errors.forEach((error) => {
      if (error.children.length) {
        result[error.property] = this.makeBody(error.children);
      }

      if (error.constraints) {
        result[error.property] = Object.values(error.constraints);
      }
    });

    return result;
  }

  getResponse() {
    let errors = {};
    if (Array.isArray(this.errors)) {
      errors = this.makeBody(this.errors);
    } else {
      errors[this.errors.field] = this.errors.message;
    }

    return {
      errors,
    };
  }
}
