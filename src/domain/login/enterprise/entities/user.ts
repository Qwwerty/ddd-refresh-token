import { Entity } from "src/core/entities/entity";
import { UniqueEntityId } from "src/core/entities/unique-entity-id";

export interface UserProps {
  name: string
  email: string
  password: string
}

export class User extends Entity<UserProps> {
  set name(name: string) {
    this.props.name = name
  }

  get name() {
    return this.props.name
  }

  set email(email: string) {
    this.props.email = email
  }

  get email() {
    return this.props.email
  }

  set password(password: string) {
    this.props.password = password
  }

  get password() {
    return this.props.password
  }

  static create(props: UserProps, id?: UniqueEntityId): User {
    return new User(props, id)
  }
}