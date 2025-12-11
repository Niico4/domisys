import React from 'react';

const Title = ({ title }: { title: string }) => {
  return (
    <h1 className="font-mochiy-pop-one text-3xl text-primary-500">{title}</h1>
  );
};

export default Title;
