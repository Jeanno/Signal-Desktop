import React from 'react';
import classNames from 'classnames';

import { Avatar } from '../Avatar';
import { Spinner } from '../Spinner';

import { LocalizerType } from '../../types/Util';
import { Contact, getName } from '../../types/Contact';

// This file starts with _ to keep it from showing up in the StyleGuide.

export function renderAvatar({
  contact,
  i18n,
  size,
  direction,
}: {
  contact: Contact;
  i18n: LocalizerType;
  size: number;
  direction?: string;
}) {
  const { avatar } = contact;

  const avatarPath = avatar && avatar.avatar && avatar.avatar.path;
  const pending = avatar && avatar.avatar && avatar.avatar.pending;
  const name = getName(contact) || '';

  if (pending) {
    return (
      <div className="module-embedded-contact__spinner-container">
        <Spinner small={size < 50} direction={direction} />
      </div>
    );
  }

  return (
    <Avatar
      avatarPath={avatarPath}
      color="grey"
      conversationType="direct"
      i18n={i18n}
      name={name}
      size={size}
    />
  );
}

export function renderName({
  contact,
  isIncoming,
  module,
}: {
  contact: Contact;
  isIncoming: boolean;
  module: string;
}) {
  return (
    <div
      className={classNames(
        `module-${module}__contact-name`,
        isIncoming ? `module-${module}__contact-name--incoming` : null
      )}
    >
      {getName(contact)}
    </div>
  );
}

export function renderContactShorthand({
  contact,
  isIncoming,
  module,
}: {
  contact: Contact;
  isIncoming: boolean;
  module: string;
}) {
  const { number: phoneNumber, email } = contact;
  const firstNumber = phoneNumber && phoneNumber[0] && phoneNumber[0].value;
  const firstEmail = email && email[0] && email[0].value;

  return (
    <div
      className={classNames(
        `module-${module}__contact-method`,
        isIncoming ? `module-${module}__contact-method--incoming` : null
      )}
    >
      {firstNumber || firstEmail}
    </div>
  );
}
