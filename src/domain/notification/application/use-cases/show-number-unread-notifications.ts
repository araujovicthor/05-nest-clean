import { Either, right } from '@/core/either'
import { NotificationsRepository } from '../repositories/notifications-repository'
import { Injectable } from '@nestjs/common'

interface ShowNumberUnreadNotificationsUseCaseRequest {
  recipientId: string
}

type ShowNumberUnreadNotificationsUseCaseResponse = Either<
  null,
  {
    unreadNotifications: number
  }
>

@Injectable()
export class ShowNumberUnreadNotificationsUseCase {
  constructor(private notificationsRepository: NotificationsRepository) {}

  async execute({
    recipientId,
  }: ShowNumberUnreadNotificationsUseCaseRequest): Promise<ShowNumberUnreadNotificationsUseCaseResponse> {
    const unreadNotifications =
      await this.notificationsRepository.countUnreadByRecipient(recipientId)

    return right({ unreadNotifications })
  }
}
