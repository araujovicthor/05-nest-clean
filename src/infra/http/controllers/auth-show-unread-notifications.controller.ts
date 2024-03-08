import { Controller, Sse } from '@nestjs/common'
import { ShowNumberUnreadNotificationsUseCase } from '@/domain/notification/application/use-cases/show-number-unread-notifications'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { defer, map, repeat } from 'rxjs'

@Controller('/auth-notifications')
export class AuthShowNumberUnreadNotificationsController {
  constructor(
    private showNumberUnreadNotifications: ShowNumberUnreadNotificationsUseCase,
  ) {}

  @Sse()
  async handle(@CurrentUser() user: UserPayload) {
    const requestUserId = user.sub

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
