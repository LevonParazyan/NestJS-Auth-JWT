import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class HashService {
  async hash(pass: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(pass, salt);
  }

  async compare(pass: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(pass, hashed);
  }
}
