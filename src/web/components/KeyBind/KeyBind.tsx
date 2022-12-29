import React, { memo } from 'react';

interface Props {
  empty?: boolean | false;
  bind?: KeyBindType;
}

export const KeyBind = (props: Props) => {
  const { empty, bind } = props;

  return <div>KeyBind</div>;
};

export default KeyBind;
