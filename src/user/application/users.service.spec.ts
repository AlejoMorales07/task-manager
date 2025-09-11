import { Test } from '@nestjs/testing'
import { UsersService } from './users.service'
import { UserRepository } from '@/user/domain/user.repository'
import { NotFoundException, ConflictException, BadRequestException } from '@nestjs/common'

describe('UsersService', () => {
  let service: UsersService
  let repo: {
    create: jest.Mock
    findById: jest.Mock
    findByEmail: jest.Mock
  }

  const validId = 'a3b1c2d3-4e5f-6789-abcd-ef0123456789'
  const notFoundId = 'b4c2d3e4-5f60-789a-bcde-f1234567890a'

  beforeEach(async () => {
    repo = {
      create: jest.fn(async (input: { email: string; name: string }) => ({ id: validId, ...input })),
      findById: jest.fn(async (id: string) => {
        if (id === validId) return { id: validId, email: 'e@e.com', name: 'John' }
        if (id === notFoundId) return null
        return null
      }),
      findByEmail: jest.fn(async (email: string) => null)
    }

    const moduleRef = await Test.createTestingModule({
      providers: [UsersService, { provide: UserRepository, useValue: repo as unknown as UserRepository }]
    }).compile()

    service = moduleRef.get(UsersService)
  })

  it('creates a user if email not taken', async () => {
    repo.findByEmail.mockResolvedValue(null)
    const res = await service.create({ email: 'e@e.com', name: 'John' })
    expect(repo.create).toHaveBeenCalledWith({ email: 'e@e.com', name: 'John' })
    expect(res).toEqual(expect.objectContaining({ email: 'e@e.com', name: 'John' }))
  })

  it('throws ConflictException if user already exists', async () => {
    repo.findByEmail.mockResolvedValue({ id: validId, email: 'e@e.com', name: 'John' })
    await expect(service.create({ email: 'e@e.com', name: 'John' })).rejects.toBeInstanceOf(ConflictException)
  })

  it('gets user by id', async () => {
    await expect(service.getById(validId)).resolves.toEqual(expect.objectContaining({ id: validId }))
  })

  it('throws NotFoundException if user not found', async () => {
    await expect(service.getById(notFoundId)).rejects.toBeInstanceOf(NotFoundException)
  })

  it('throws BadRequestException if id is not un UUID v4 válido', async () => {
    await expect(service.getById('not-a-uuid')).rejects.toBeInstanceOf(BadRequestException)
    await expect(service.getById('12345678-1234-1234-1234-1234567890')).rejects.toBeInstanceOf(BadRequestException)
  })
})
