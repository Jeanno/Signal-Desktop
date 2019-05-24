import * as React from 'react';
import classNames from 'classnames';
import { noop } from 'lodash';
import { Manager, Popper, Reference } from 'react-popper';
import { createPortal } from 'react-dom';
import { EmojiPicker, Props as EmojiPickerProps } from './EmojiPicker';
import { LocalizerType } from '../../types/Util';

export type OwnProps = {
  readonly i18n: LocalizerType;
};

export type Props = OwnProps &
  Pick<
    EmojiPickerProps,
    'onPickEmoji' | 'skinTone' | 'onSetSkinTone' | 'recentEmojis'
  >;

export const EmojiButton = React.memo(
  ({ i18n, onPickEmoji, skinTone, onSetSkinTone, recentEmojis }: Props) => {
    const [open, setOpen] = React.useState(false);
    const [popperRoot, setPopperRoot] = React.useState<HTMLElement | null>(
      null
    );

    const handleClickButton = React.useCallback(
      () => {
        if (popperRoot) {
          setOpen(false);
        } else {
          setOpen(true);
        }
      },
      [popperRoot, setOpen]
    );

    const handleClose = React.useCallback(
      () => {
        setOpen(false);
      },
      [setOpen]
    );

    // Create popper root and handle outside clicks
    React.useEffect(
      () => {
        if (open) {
          const root = document.createElement('div');
          setPopperRoot(root);
          document.body.appendChild(root);
          const handleOutsideClick = ({ target }: MouseEvent) => {
            if (!root.contains(target as Node)) {
              setOpen(false);
            }
          };
          document.addEventListener('click', handleOutsideClick);

          return () => {
            document.body.removeChild(root);
            document.removeEventListener('click', handleOutsideClick);
            setPopperRoot(null);
          };
        }

        return noop;
      },
      [open, setOpen, setPopperRoot]
    );

    return (
      <Manager>
        <Reference>
          {({ ref }) => (
            <button
              ref={ref}
              onClick={handleClickButton}
              className={classNames({
                'module-emoji-button__button': true,
                'module-emoji-button__button--active': open,
              })}
            />
          )}
        </Reference>
        {open && popperRoot
          ? createPortal(
              <Popper placement="top-start">
                {({ ref, style }) => (
                  <EmojiPicker
                    ref={ref}
                    i18n={i18n}
                    style={style}
                    onPickEmoji={onPickEmoji}
                    onClose={handleClose}
                    skinTone={skinTone}
                    onSetSkinTone={onSetSkinTone}
                    recentEmojis={recentEmojis}
                  />
                )}
              </Popper>,
              popperRoot
            )
          : null}
      </Manager>
    );
  }
);
