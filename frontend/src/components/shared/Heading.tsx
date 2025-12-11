import React from 'react';

const Title = ({ title, subtitle }: { title: string; subtitle?: string }) => {
  return (
    <div>
      <h1 className="font-mochiy-pop-one text-3xl text-primary-500">{title}</h1>
      <p className="text-default-500 mt-1">{subtitle}</p>
    </div>
  );
};

export default Title;
