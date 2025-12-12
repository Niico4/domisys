'use client';

import { Card, CardBody, Skeleton } from '@heroui/react';

export const ProductCardSkeleton = () => {
  return (
    <Card className="w-full bg-[#F9EFD8] shadow-sm">
      <CardBody className="p-0">
        <div className="relative w-full aspect-square rounded-t-lg overflow-hidden bg-default-100">
          <Skeleton className="w-full h-full rounded-lg" />
        </div>

        <div className="p-4 space-y-2">
          <Skeleton className="h-5 w-3/4 rounded" />
          <Skeleton className="h-4 w-1/2 rounded" />
          <Skeleton className="h-10 w-full rounded-lg mt-2" />
        </div>
      </CardBody>
    </Card>
  );
};
