// Real Camera & Mic Stream Manager

export interface MediaDeviceInfoList {
  videoInputs: MediaDeviceInfo[];
  audioInputs: MediaDeviceInfo[];
}

export async function getAvailableMediaDevices(): Promise<MediaDeviceInfoList> {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return {
      videoInputs: devices.filter(d => d.kind === 'videoinput'),
      audioInputs: devices.filter(d => d.kind === 'audioinput')
    };
  } catch (e) {
    console.warn('Could not enumerate media devices', e);
    return { videoInputs: [], audioInputs: [] };
  }
}

export async function requestUserMediaStream(
  video: boolean = true,
  audio: boolean = true,
  preferredVideoId?: string,
  preferredAudioId?: string
): Promise<MediaStream | null> {
  try {
    const constraints: MediaStreamConstraints = {
      video: video
        ? {
            deviceId: preferredVideoId ? { exact: preferredVideoId } : undefined,
            width: { ideal: 640 },
            height: { ideal: 480 },
            frameRate: { ideal: 30 }
          }
        : false,
      audio: audio
        ? {
            deviceId: preferredAudioId ? { exact: preferredAudioId } : undefined,
            echoCancellation: true,
            noiseSuppression: true
          }
        : false
    };

    return await navigator.mediaDevices.getUserMedia(constraints);
  } catch (error) {
    console.error('Camera/Mic permission failed or unavailable:', error);
    return null;
  }
}

export function stopMediaStream(stream: MediaStream | null) {
  if (!stream) return;
  stream.getTracks().forEach(track => {
    track.stop();
  });
}
