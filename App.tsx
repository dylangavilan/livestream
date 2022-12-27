import React, { useEffect, useRef, useState } from 'react';
import { View, TouchableOpacity, PermissionsAndroid, Text } from 'react-native';
import {
  LiveStreamMethods,
  LiveStreamView,
} from '@api.video/react-native-livestream';
const App = () => {
  const [hasPermissions, setHasPermissions] = useState(false);
  const ref = useRef<LiveStreamMethods>(null);
  const [streaming, setStreaming] = useState(false);

  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.CAMERA,
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      ]);

      if (
        granted['android.permission.CAMERA'] ===
          PermissionsAndroid.RESULTS.GRANTED &&
        granted['android.permission.RECORD_AUDIO'] ===
          PermissionsAndroid.RESULTS.GRANTED
      ) {
        setHasPermissions(true);
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  useEffect(() => {
    requestCameraPermission();
  }, []);

  return (
    <View style={{ flex: 1, alignItems: 'center', backgroundColor: '#fff' }}>
      {hasPermissions && (
        <LiveStreamView
          style={{
            flex: 1,
            backgroundColor: 'black',
            alignSelf: 'stretch',
            height: 500,
          }}
          ref={ref}
          camera="front"
          video={{
            fps: 30,
            resolution: '480p',
            bitrate: 1 * 1024 * 1024, // # 2 Mbps
          }}
          enablePinchedZoom
          audio={{
            bitrate: 64000,
            sampleRate: 44100,
            isStereo: true,
          }}
          onConnectionSuccess={() => {
            console.log('success')
            //do what you want
          }}
          onConnectionFailed={e => {
            //do what you want
            console.log('failed')

          }}
          onDisconnect={() => {
            //do what you want
            console.log('disconnect')

          }}
        />
      )}
      <View style={{ position: 'absolute', bottom: 40 }}>
        <TouchableOpacity
          style={{
            borderRadius: 50,
            backgroundColor: 'red',
            width: 70,
            height: 50,
          }}
          onPress={() => {
            if (streaming) {
              ref.current?.stopStreaming();
              setStreaming(false);
            } else {
              ref.current?.startStreaming('61d5c534af5cc9c30432ae416df81cd61dc0a5c530b31146995f45111158d363', 
              'rtmp://ec2-54-204-171-227.compute-1.amazonaws.com:1935/')
              setStreaming(true);
            }
          }}
        >
          <Text>{streaming ? 'Stop stream' : 'Start stream'}</Text>
        </TouchableOpacity>
    
      </View>
    </View>
  );
};

export default App;
