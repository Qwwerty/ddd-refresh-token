import { Controller, Get } from "@nestjs/common";

@Controller('/hello-world')
export class HelloWorldController {

  @Get()
  async handle() {
    return 'Hello world'
  }
}