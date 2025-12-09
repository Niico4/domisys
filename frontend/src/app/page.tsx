'use client';

import { Button } from '@heroui/react';

const Home = () => {
  return (
    <div className="flex flex-col gap-8 p-8">
      <div className="flex flex-wrap gap-4 items-center">
        <Button color="default" variant="solid">
          Solid
        </Button>
        <Button color="default" variant="faded">
          Faded
        </Button>
        <Button color="default" variant="bordered">
          Bordered
        </Button>
        <Button color="default" variant="light">
          Light
        </Button>
        <Button color="default" variant="flat">
          Flat
        </Button>
        <Button color="default" variant="ghost">
          Ghost
        </Button>
        <Button color="default" variant="shadow">
          Shadow
        </Button>
      </div>

      <div className="flex flex-wrap gap-4 items-center">
        <Button color="primary" variant="solid">
          Solid
        </Button>
        <Button color="primary" variant="faded">
          Faded
        </Button>
        <Button color="primary" variant="bordered">
          Bordered
        </Button>
        <Button color="primary" variant="light">
          Light
        </Button>
        <Button color="primary" variant="flat">
          Flat
        </Button>
        <Button color="primary" variant="ghost">
          Ghost
        </Button>
        <Button color="primary" variant="shadow">
          Shadow
        </Button>
      </div>
      <div className="flex flex-wrap gap-4 items-center">
        <Button color="secondary" variant="solid">
          Solid
        </Button>
        <Button color="secondary" variant="faded">
          Faded
        </Button>
        <Button color="secondary" variant="bordered">
          Bordered
        </Button>
        <Button color="secondary" variant="light">
          Light
        </Button>
        <Button color="secondary" variant="flat">
          Flat
        </Button>
        <Button color="secondary" variant="ghost">
          Ghost
        </Button>
        <Button color="secondary" variant="shadow">
          Shadow
        </Button>
      </div>
      <div className="flex flex-wrap gap-4 items-center">
        <Button color="success" variant="solid">
          Solid
        </Button>
        <Button color="success" variant="faded">
          Faded
        </Button>
        <Button color="success" variant="bordered">
          Bordered
        </Button>
        <Button color="success" variant="light">
          Light
        </Button>
        <Button color="success" variant="flat">
          Flat
        </Button>
        <Button color="success" variant="ghost">
          Ghost
        </Button>
        <Button color="success" variant="shadow">
          Shadow
        </Button>
      </div>

      <div className="flex flex-wrap gap-4 items-center">
        <Button color="warning" variant="solid">
          Solid
        </Button>
        <Button color="warning" variant="faded">
          Faded
        </Button>
        <Button color="warning" variant="bordered">
          Bordered
        </Button>
        <Button color="warning" variant="light">
          Light
        </Button>
        <Button color="warning" variant="flat">
          Flat
        </Button>
        <Button color="warning" variant="ghost">
          Ghost
        </Button>
        <Button color="warning" variant="shadow">
          Shadow
        </Button>
      </div>

      <div className="flex flex-wrap gap-4 items-center">
        <Button color="danger" variant="solid">
          Solid
        </Button>
        <Button color="danger" variant="faded">
          Faded
        </Button>
        <Button color="danger" variant="bordered">
          Bordered
        </Button>
        <Button color="danger" variant="light">
          Light
        </Button>
        <Button color="danger" variant="flat">
          Flat
        </Button>
        <Button color="danger" variant="ghost">
          Ghost
        </Button>
        <Button color="danger" variant="shadow">
          Shadow
        </Button>
      </div>
    </div>
  );
};

export default Home;
