import { Entity } from 'src/core/entities/entity';
import { UniqueEntityId } from 'src/core/entities/unique-entity-id';
import { User } from './user';

export interface RefreshTokenProps {
  token: string
  expiresIn: number;
  user: User;
}

export class RefreshToken extends Entity<RefreshTokenProps> {
  set token(token: string) {
    this.props.token = token
  }

  get token() {
    return this.props.token;
  }
  
  get expiresIn() {
    return this.props.expiresIn;
  }

  get user() {
    return this.props.user;
  }

    static create(props: RefreshTokenProps, id?: UniqueEntityId): RefreshToken {
      return new RefreshToken(props, id)
    }
}
