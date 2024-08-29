import React from 'react';

type TypoProps = {
  type:
    | 'title1'
    | 'title2'
    | 'title3'
    | 'title4'
    | 'body1'
    | 'body2'
    | 'body3'
    | 'body4'
    | 'caption'
    | 'overline';
  children: React.ReactNode;
};

const classMap: { [key in TypoProps['type']]: string } = {
  title1: 'text-title1',
  title2: 'text-title2',
  title3: 'text-title3',
  title4: 'text-title4',
  body1: 'text-body1',
  body2: 'text-body2',
  body3: 'text-body3',
  body4: 'text-body4',
  caption: 'text-caption',
  overline: 'text-overline',
};

const Typo = ({ type, children }: TypoProps) => {
  const Tag = (() => {
    switch (type) {
      case 'title1':
        return 'h1';
      case 'title2':
        return 'h2';
      case 'title3':
        return 'h3';
      case 'title4':
        return 'h4';
      case 'body1':
      case 'body2':
      case 'body3':
      case 'body4':
      case 'caption':
      case 'overline':
        return 'p';
      default:
        return 'p'; // fallback
    }
  })();

  return <Tag className={classMap[type]}>{children}</Tag>;
};

export default Typo;
