import React from 'react';
import classnames from 'classnames';

interface Props {
  type: string;
  onClick: () => void;
}

export class Notification extends React.Component<Props> {
  public renderContents() {
    const { type } = this.props;

    return <span>Notification of type {type}</span>;
  }

  public render() {
    const { onClick } = this.props;

    return (
      <div
        role="button"
        onClick={onClick}
        className={classnames(
          'module-notification',
          onClick ? 'module-notification--with-click-handler' : null
        )}
      >
        {this.renderContents()}
      </div>
    );
  }
}
