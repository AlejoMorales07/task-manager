import { TasksService } from '@/task/application/tasks.service'
import { Task, TaskStatus } from '@/task/domain/task.entity'
import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common'
import { ApiDefaultResponse, ApiOkResponse, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger'
import { CreateTaskDto } from './dto/create-task.dto'
import { UpdateTaskStatusDto } from './dto/update-task.dto'

@ApiTags('tasks')
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  /**
   * List tasks by user
   * @remarks This endpoint retrieves a list of tasks for a specific user.
   * @throws {400} Invalid user ID or pagination parameters
   * @throws {404} User not found
   * @throws {500} Internal server error
   */
  @ApiOkResponse({ description: 'List of tasks retrieved successfully', type: [Task] })
  @ApiDefaultResponse({ description: 'Unexpected error' })
  @ApiParam({ name: 'userId', description: 'ID of the user whose tasks are to be retrieved' })
  @ApiQuery({ name: 'status', required: false, type: String, description: 'Filter by task status' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of tasks per page' })
  @Get('user/:userId')
  listByUser(@Param('userId') userId: string, @Query('status') status?: TaskStatus, @Query('page') page?: string, @Query('limit') limit?: string) {
    return this.tasksService.listByUser(userId, { status: status }, { page: Number(page), limit: Number(limit) })
  }

  /**
   * Create a new task
   * @remarks This endpoint creates a new task.
   * @throws {400} Invalid user ID or pagination parameters
   * @throws {404} User not found
   * @throws {500} Internal server error
   */
  @Post()
  @ApiOkResponse({ description: 'Task created successfully', type: Task })
  @ApiDefaultResponse({ description: 'Unexpected error' })
  create(@Body() dto: CreateTaskDto) {
    return this.tasksService.create(dto)
  }

  /**
   * Update the status of a task
   * @remarks This endpoint updates the status of a specific task.
   * @throws {400} Invalid task ID or status
   * @throws {404} Task not found
   * @throws {500} Internal server error
   */
  @Patch(':id')
  @ApiOkResponse({ description: 'Task status updated successfully', type: Task })
  @ApiDefaultResponse({ description: 'Unexpected error' })
  @ApiParam({ name: 'id', description: 'ID of the task to be updated' })
  updateStatus(@Param('id') id: string, @Body() dto: UpdateTaskStatusDto) {
    return this.tasksService.updateStatus(id, dto.status)
  }

  /**
   * Delete a task
   * @remarks This endpoint deletes a specific task.
   * @throws {400} Invalid task ID
   * @throws {404} Task not found
   * @throws {500} Internal server error
   */
  @Delete(':id')
  @ApiOkResponse({ description: 'Task deleted successfully', schema: { example: { success: true } } })
  @ApiDefaultResponse({ description: 'Unexpected error' })
  @ApiParam({ name: 'id', description: 'ID of the task to be deleted' })
  remove(@Param('id') id: string) {
    return this.tasksService.softDelete(id)
  }
}
