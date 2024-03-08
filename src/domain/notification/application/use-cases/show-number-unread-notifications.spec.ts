import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository'
import { ShowNumberUnreadNotificationsUseCase } from './show-number-unread-notifications'
import { makeNotification } from 'test/factories/make-notification'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let sut: ShowNumberUnreadNotificationsUseCase

describe('Show Number Unread Notifications', () => {
  beforeEach(() => {
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
    sut = new ShowNumberUnreadNotificationsUseCase(
      inMemoryNotificationsRepository,
    )
  })

  it('should be able to show a number of unread notifications for an recipient', async () => {
    const recipientId = new UniqueEntityID()

    for (let i = 1; i <= 22; i++) {
      await inMemoryNotificationsRepository.create(
        makeNotification({ recipientId }),
      )
    }

    for (let i = 1; i <= 15; i++) {
      await inMemoryNotificationsRepository.create(
        makeNotification({ recipientId, readAt: new Date() }),
      )
    }

    for (let i = 1; i <= 100; i++) {
      await inMemoryNotificationsRepository.create(makeNotification({}))
    }

    const result = await sut.execute({
      recipientId: recipientId.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.unreadNotifications).toEqual(22)
  })
})
