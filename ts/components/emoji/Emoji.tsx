// Copyright 2019-2020 Signal Messenger, LLC
// SPDX-License-Identifier: AGPL-3.0-only

import * as React from 'react';
import classNames from 'classnames';
import { emojiToImage, getImagePath, SkinToneKey } from './lib';

export const EmojiSizes = [16, 18, 20, 24, 28, 32, 48, 64, 66] as const;

export type EmojiSizeType = typeof EmojiSizes[number];

export type OwnProps = {
  inline?: boolean;
  emoji?: string;
  shortName?: string;
  skinTone?: SkinToneKey | number;
  size?: EmojiSizeType;
  children?: React.ReactNode;
};

export type Props = OwnProps &
  Pick<React.HTMLProps<HTMLDivElement>, 'style' | 'className'>;

export const Emoji = React.memo(
  React.forwardRef<HTMLDivElement, Props>(
    (
      {
        style = {},
        size = 28,
        shortName,
        skinTone,
        emoji,
        inline,
        className,
        children,
      }: Props,
      ref
    ) => {
      let image = '';
      if (shortName) {
        image = getImagePath(shortName, skinTone);
      } else if (emoji) {
        image = emojiToImage(emoji) || '';
      }

      const backgroundStyle = inline
        ? { backgroundImage: `url('${image}')` }
        : {};

      return (
        <span
          ref={ref}
          className={classNames(
            'module-emoji',
            `module-emoji--${size}px`,
            inline ? `module-emoji--${size}px--inline` : null,
            className
          )}
          style={{ ...style, ...backgroundStyle }}
        >
          {inline ? (
            // When using this component as in a CompositionInput it is very
            // important that these children are the only elements to render
            children
          ) : (
            <img
              className={`module-emoji__image--${size}px`}
              src={image}
              alt={shortName}
            />
          )}
        </span>
      );
    }
  )
);
