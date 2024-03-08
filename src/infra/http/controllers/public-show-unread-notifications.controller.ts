import { Controller, Param, Sse } from '@nestjs/common'
import { ShowNumberUnreadNotificationsUseCase } from '@/domain/notification/application/use-cases/show-number-unread-notifications'
import { defer, map, repeat } from 'rxjs'
import { Public } from '@/infra/auth/public'

@Controller('/public-notifications')
@Public()
export class PublicShowNumberUnreadNotificationsController {
  constructor(
    private showNumberUnreadNotifications: ShowNumberUnreadNotificationsUseCase,
  ) {}

  @Sse('/:id')
  async handle(@Param('id') id: string) {
    const requestUserId = id

    return defer(() =>
      this.showNumberUnreadNotifications.execute({
        recipientId: requestUserId,
      }),
    ).pipe(
      repeat({
        delay: 1000,
      }),
      map((unreadNotifications) => ({
        type: 'message',
        data: unreadNotifications,
      })),
    )
  }
}
