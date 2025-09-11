import { UsersService } from '@/user/application/users.service'
import { User } from '@/user/domain/user.entity'
import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import { ApiCreatedResponse, ApiDefaultResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { CreateUserDto } from './dto/create-user.dto'

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Get user by id
   * @remarks This endpoint retrieves a user by their ID.
   * @throws {400} Invalid user ID format
   * @throws {404} User not found
   * @throws {500} Internal server error
   */
  @ApiOkResponse({ description: 'User retrieved successfully', type: User })
  @ApiDefaultResponse({ description: 'Unexpected error' })
  @Get(':id')
  get(@Param('id') id: string) {
    return this.usersService.getById(id)
  }

  /**
   * Create a new user
   * @remarks This endpoint creates a new user.
   * @throws {400} Invalid user data
   * @throws {409} User already exists
   * @throws {500} Internal server error
   */
  @ApiCreatedResponse({ description: 'User created', type: User })
  @ApiDefaultResponse({ description: 'Unexpected error' })
  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto)
  }
}
