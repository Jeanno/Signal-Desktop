import * as React from 'react';
import { Editor } from 'draft-js';
import { noop } from 'lodash';
import classNames from 'classnames';
import {
  EmojiButton,
  EmojiPickDataType,
  Props as EmojiButtonProps,
} from './emoji/EmojiButton';
import {
  Props as StickerButtonProps,
  StickerButton,
} from './stickers/StickerButton';
import {
  CompositionInput,
  InputApi,
  Props as CompositionInputProps,
} from './CompositionInput';
import { countStickers } from './stickers/lib';
import { LocalizerType } from '../types/Util';

export type OwnProps = {
  readonly i18n: LocalizerType;
  readonly compositionApi?: React.MutableRefObject<{
    focusInput: () => void;
    setDisabled: (disabled: boolean) => void;
    setShowMic: (showMic: boolean) => void;
    setMicActive: (micActive: boolean) => void;
    attSlotRef: React.RefObject<HTMLDivElement>;
    reset: InputApi['reset'];
    resetEmojiResults: InputApi['resetEmojiResults'];
  }>;
  readonly micCellEl?: HTMLElement;
  readonly attCellEl?: HTMLElement;
  readonly attachmentListEl?: HTMLElement;
};

export type Props = Pick<
  CompositionInputProps,
  'onSubmit' | 'onEditorSizeChange' | 'onEditorStateChange'
> &
  Pick<
    EmojiButtonProps,
    'onPickEmoji' | 'onSetSkinTone' | 'recentEmojis' | 'skinTone'
  > &
  Pick<
    StickerButtonProps,
    | 'knownPacks'
    | 'receivedPacks'
    | 'installedPacks'
    | 'blessedPacks'
    | 'recentStickers'
    | 'clearInstalledStickerPack'
    | 'onClickAddPack'
    | 'onPickSticker'
    | 'clearShowIntroduction'
    | 'showPickerHint'
    | 'clearShowPickerHint'
  > &
  OwnProps;

const emptyElement = (el: HTMLElement) => {
  // tslint:disable-next-line no-inner-html
  el.innerHTML = '';
};

// tslint:disable-next-line max-func-body-length
export const CompositionArea = ({
  i18n,
  attachmentListEl,
  micCellEl,
  attCellEl,
  // CompositionInput
  onSubmit,
  compositionApi,
  onEditorSizeChange,
  onEditorStateChange,
  // EmojiButton
  onPickEmoji,
  onSetSkinTone,
  recentEmojis,
  skinTone,
  // StickerButton
  knownPacks,
  receivedPacks,
  installedPacks,
  blessedPacks,
  recentStickers,
  clearInstalledStickerPack,
  onClickAddPack,
  onPickSticker,
  clearShowIntroduction,
  showPickerHint,
  clearShowPickerHint,
}: Props) => {
  const [disabled, setDisabled] = React.useState(false);
  const [showMic, setShowMic] = React.useState(true);
  const [micActive, setMicActive] = React.useState(false);
  const [dirty, setDirty] = React.useState(false);
  const [large, setLarge] = React.useState(false);
  const editorRef = React.useRef<Editor>(null);
  const inputApiRef = React.useRef<InputApi | undefined>();

  const handleForceSend = React.useCallback(
    () => {
      setLarge(false);
      if (inputApiRef.current) {
        inputApiRef.current.submit();
      }
    },
    [inputApiRef, setLarge]
  );

  const handleSubmit = React.useCallback<typeof onSubmit>(
    (...args) => {
      setLarge(false);
      onSubmit(...args);
    },
    [setLarge, onSubmit]
  );

  const focusInput = React.useCallback(
    () => {
      if (editorRef.current) {
        editorRef.current.focus();
      }
    },
    [editorRef]
  );

  const withStickers =
    countStickers({
      knownPacks,
      blessedPacks,
      installedPacks,
      receivedPacks,
    }) > 0;

  // A ref to grab a slot where backbone can insert link previews and attachments
  const attSlotRef = React.useRef<HTMLDivElement>(null);

  if (compositionApi) {
    compositionApi.current = {
      focusInput,
      setDisabled,
      setShowMic,
      setMicActive,
      attSlotRef,
      reset: () => {
        if (inputApiRef.current) {
          inputApiRef.current.reset();
        }
      },
      resetEmojiResults: () => {
        if (inputApiRef.current) {
          inputApiRef.current.resetEmojiResults();
        }
      },
    };
  }

  const insertEmoji = React.useCallback(
    (e: EmojiPickDataType) => {
      if (inputApiRef.current) {
        inputApiRef.current.insertEmoji(e);
        onPickEmoji(e);
      }
    },
    [inputApiRef, onPickEmoji]
  );

  const handleToggleLarge = React.useCallback(
    () => {
      setLarge(l => !l);
    },
    [setLarge]
  );

  // The following is a work-around to allow react to lay-out backbone-managed
  // dom nodes until those functions are in React
  const micCellRef = React.useRef<HTMLDivElement>(null);
  const attCellRef = React.useRef<HTMLDivElement>(null);
  React.useLayoutEffect(
    () => {
      const { current: micCellContainer } = micCellRef;
      const { current: attCellContainer } = attCellRef;
      if (micCellContainer && micCellEl) {
        emptyElement(micCellContainer);
        micCellContainer.appendChild(micCellEl);
      }
      if (attCellContainer && attCellEl) {
        emptyElement(attCellContainer);
        attCellContainer.appendChild(attCellEl);
      }

      return noop;
    },
    [micCellRef, attCellRef, micCellEl, attCellEl, large, dirty, showMic]
  );

  React.useLayoutEffect(
    () => {
      const { current: attSlot } = attSlotRef;
      if (attSlot && attachmentListEl) {
        attSlot.appendChild(attachmentListEl);
      }

      return noop;
    },
    [attSlotRef, attachmentListEl]
  );

  const emojiButtonFragment = (
    <div className="module-composition-area__button-cell">
      <EmojiButton
        i18n={i18n}
        doSend={handleForceSend}
        onPickEmoji={insertEmoji}
        recentEmojis={recentEmojis}
        skinTone={skinTone}
        onSetSkinTone={onSetSkinTone}
        onClose={focusInput}
      />
    </div>
  );

  const micButtonFragment = showMic ? (
    <div
      className={classNames(
        'module-composition-area__button-cell',
        micActive ? 'module-composition-area__button-cell--mic-active' : null,
        large ? 'module-composition-area__button-cell--large-right' : null
      )}
      ref={micCellRef}
    />
  ) : null;

  const attButtonFragment = (
    <div className="module-composition-area__button-cell" ref={attCellRef} />
  );

  const sendButtonFragment = (
    <div
      className={classNames(
        'module-composition-area__button-cell',
        large ? 'module-composition-area__button-cell--large-right' : null
      )}
    >
      <button
        className="module-composition-area__send-button"
        onClick={handleForceSend}
      />
    </div>
  );

  const stickerButtonPlacement = large ? 'top-start' : 'top-end';
  const stickerButtonFragment = withStickers ? (
    <div className="module-composition-area__button-cell">
      <StickerButton
        i18n={i18n}
        knownPacks={knownPacks}
        receivedPacks={receivedPacks}
        installedPacks={installedPacks}
        blessedPacks={blessedPacks}
        recentStickers={recentStickers}
        clearInstalledStickerPack={clearInstalledStickerPack}
        onClickAddPack={onClickAddPack}
        onPickSticker={onPickSticker}
        clearShowIntroduction={clearShowIntroduction}
        showPickerHint={showPickerHint}
        clearShowPickerHint={clearShowPickerHint}
        position={stickerButtonPlacement}
      />
    </div>
  ) : null;

  return (
    <div className="module-composition-area">
      <div
        className={classNames(
          'module-composition-area__row',
          'module-composition-area__row--center',
          'module-composition-area__row--show-on-focus'
        )}
      >
        <button
          className={classNames(
            'module-composition-area__toggle-large',
            large ? 'module-composition-area__toggle-large--large-active' : null
          )}
          onClick={handleToggleLarge}
        />
      </div>
      <div
        className={classNames(
          'module-composition-area__row',
          'module-composition-area__row--column'
        )}
        ref={attSlotRef}
      />
      <div
        className={classNames(
          'module-composition-area__row',
          large ? 'module-composition-area__row--padded' : null
        )}
      >
        {!large ? emojiButtonFragment : null}
        <div className="module-composition-area__input">
          <CompositionInput
            i18n={i18n}
            disabled={disabled}
            large={large}
            editorRef={editorRef}
            inputApi={inputApiRef}
            onPickEmoji={onPickEmoji}
            onSubmit={handleSubmit}
            onEditorSizeChange={onEditorSizeChange}
            onEditorStateChange={onEditorStateChange}
            onDirtyChange={setDirty}
            skinTone={skinTone}
          />
        </div>
        {!large ? (
          <>
            {stickerButtonFragment}
            {!dirty ? micButtonFragment : null}
            {attButtonFragment}
          </>
        ) : null}
      </div>
      {large ? (
        <div
          className={classNames(
            'module-composition-area__row',
            'module-composition-area__row--control-row'
          )}
        >
          {emojiButtonFragment}
          {stickerButtonFragment}
          {attButtonFragment}
          {!dirty ? micButtonFragment : null}
          {dirty || !showMic ? sendButtonFragment : null}
        </div>
      ) : null}
    </div>
  );
};
