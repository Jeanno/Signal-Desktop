import React from 'react';
import { CallingPip } from './CallingPip';
import { CallNeedPermissionScreen } from './CallNeedPermissionScreen';
import { CallScreen, PropsType as CallScreenPropsType } from './CallScreen';
import {
  IncomingCallBar,
  PropsType as IncomingCallBarPropsType,
} from './IncomingCallBar';
import { CallState, CallEndedReason } from '../types/Calling';
import { CallDetailsType } from '../state/ducks/calling';

type CallManagerPropsType = {
  callDetails?: CallDetailsType;
  callState?: CallState;
  callEndedReason?: CallEndedReason;
  pip: boolean;
  closeNeedPermissionScreen: () => void;
  renderDeviceSelection: () => JSX.Element;
  settingsDialogOpen: boolean;
};

type PropsType = IncomingCallBarPropsType &
  CallScreenPropsType &
  CallManagerPropsType;

export const CallManager = ({
  acceptCall,
  callDetails,
  callState,
  callEndedReason,
  closeNeedPermissionScreen,
  declineCall,
  hangUp,
  hasLocalAudio,
  hasLocalVideo,
  hasRemoteVideo,
  i18n,
  pip,
  renderDeviceSelection,
  setLocalAudio,
  setLocalPreview,
  setLocalVideo,
  setRendererCanvas,
  settingsDialogOpen,
  togglePip,
  toggleSettings,
}: PropsType): JSX.Element | null => {
  if (!callDetails || !callState) {
    return null;
  }
  const incoming = callDetails.isIncoming;
  const outgoing = !incoming;
  const ongoing =
    callState === CallState.Accepted || callState === CallState.Reconnecting;
  const ringing = callState === CallState.Ringing;
  const ended = callState === CallState.Ended;

  if (ended) {
    if (callEndedReason === CallEndedReason.RemoteHangupNeedPermission) {
      return (
        <CallNeedPermissionScreen
          close={closeNeedPermissionScreen}
          callDetails={callDetails}
          i18n={i18n}
        />
      );
    }
    return null;
  }

  if (outgoing || ongoing) {
    if (pip) {
      return (
        <CallingPip
          callDetails={callDetails}
          hangUp={hangUp}
          hasLocalVideo={hasLocalVideo}
          hasRemoteVideo={hasRemoteVideo}
          i18n={i18n}
          setLocalPreview={setLocalPreview}
          setRendererCanvas={setRendererCanvas}
          togglePip={togglePip}
        />
      );
    }

    return (
      <>
        <CallScreen
          callDetails={callDetails}
          callState={callState}
          hangUp={hangUp}
          hasLocalAudio={hasLocalAudio}
          hasLocalVideo={hasLocalVideo}
          i18n={i18n}
          hasRemoteVideo={hasRemoteVideo}
          setLocalPreview={setLocalPreview}
          setRendererCanvas={setRendererCanvas}
          setLocalAudio={setLocalAudio}
          setLocalVideo={setLocalVideo}
          togglePip={togglePip}
          toggleSettings={toggleSettings}
        />
        {settingsDialogOpen && renderDeviceSelection()}
      </>
    );
  }

  if (incoming && ringing) {
    return (
      <IncomingCallBar
        acceptCall={acceptCall}
        callDetails={callDetails}
        declineCall={declineCall}
        i18n={i18n}
      />
    );
  }

  // Incoming && Prering
  return null;
};
