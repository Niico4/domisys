import { OrderState, UserRole } from '@/generated/enums';
import { prisma } from '@/data/postgresql';

import { BadRequestException } from '@/shared/exceptions/bad-request';
import { messages } from '@/shared/messages';

export class DeliveryAssignmentService {
  async assignDelivery(): Promise<number> {
    const deliveryUsers = await prisma.user.findMany({
      where: {
        role: UserRole.delivery,
      },
    });

    if (deliveryUsers.length === 0) {
      throw new BadRequestException(messages.delivery.noDeliveriesRegistered());
    }

    const deliveriesWithCount = await Promise.all(
      deliveryUsers.map(async (delivery) => {
        const activeOrdersCount = await prisma.order.count({
          where: {
            deliveryId: delivery.id,
            state: {
              notIn: [OrderState.delivered, OrderState.cancel],
            },
          },
        });

        return {
          delivery,
          activeOrdersCount,
        };
      })
    );

    deliveriesWithCount.sort(
      (a, b) => a.activeOrdersCount - b.activeOrdersCount
    );

    if (!deliveriesWithCount[0]) {
      throw new BadRequestException(messages.delivery.cannotAssign());
    }

    return deliveriesWithCount[0].delivery.id;
  }
}
