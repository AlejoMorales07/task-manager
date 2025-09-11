import { UsersService } from '@/user/application/users.service'
import { Test } from '@nestjs/testing'
import { UsersController } from './users.controller'

describe('UsersController', () => {
  it('should create user', async () => {
    const module = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            create: jest.fn().mockResolvedValue({
              id: '1',
              email: 'a@b.com',
              name: 'A',
              createdAt: new Date()
            }),
            getById: jest.fn().mockResolvedValue({
              id: '1',
              email: 'a@b.com',
              name: 'A',
              createdAt: new Date()
            })
          }
        }
      ]
    }).compile()

    const controller = module.get(UsersController)
    const res = await controller.create({ email: 'a@b.com', name: 'A' })
    expect(res).toHaveProperty('id')
  })

  it('should get user by id', async () => {
    const module = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            getById: jest.fn().mockResolvedValue({
              id: '1',
              email: 'a@b.com',
              name: 'A',
              createdAt: new Date()
            })
          }
        }
      ]
    }).compile()

    const controller = module.get(UsersController)
    const res = await controller.get('1')
    expect(res).toHaveProperty('id')
    expect(res).toHaveProperty('email', 'a@b.com')
  })
})
