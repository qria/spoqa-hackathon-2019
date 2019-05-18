import React from 'react';
import RNSoundLevel from 'react-native-sound-level'
import Sound from 'react-native-sound';

import { Image, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { RNCamera } from 'react-native-camera';

const BLOWING_THRESHHOLD = -10;
const CANDLE_OFF_SECONDS = 3;

export default class App extends React.Component {
  state = {
    blowingSeconds: 0,
    candleOn: true,
    noiseLevel: null,
  }

  componentDidMount() {
    Sound.setCategory('Playback');
    var whoosh = new Sound('./assets/applause.mp3', Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.log('failed to load the sound', error);
        return;
      }
      // loaded successfully
      console.log('duration in seconds: ' + whoosh.getDuration() + 'number of channels: ' + whoosh.getNumberOfChannels());

      // Play the sound with an onEnd callback
      whoosh.play((success) => {
        if (success) {
          console.log('successfully finished playing');
        } else {
          console.log('playback failed due to audio decoding errors');
        }
      });
    });
    RNSoundLevel.start()
    RNSoundLevel.onNewFrame = (data) => {
      // This is called each seconds
      const { blowingSeconds } = this.state;
      if (data == null) {
        // mic ain't workin'
        return;
      }
      if (blowingSeconds > CANDLE_OFF_SECONDS) {
        this.setState({
          candleOn: false,
        })
      }
      noiseLevel = data.value;
      if (noiseLevel > BLOWING_THRESHHOLD) {
        newBlowingSeconds = blowingSeconds + 1
      } else {
        newBlowingSeconds = 0
      }

      this.setState({ noiseLevel });
      this.setState({ blowingSeconds: newBlowingSeconds});
    }
  }

  componentWillUnmount() {
    RNSoundLevel.stop()
  }

  rekindle() {
    this.setState({
      candleOn: true,
    })
  }

  render() {
    const { candleOn, noiseLevel }  = this.state;
    const isBlowing = noiseLevel > BLOWING_THRESHHOLD;

    const cakeImage = require('./assets/cake_base.png');
    const fireIdleImage = require('./assets/fire_idle.png');
    const fireMovingImage = require('./assets/fire.gif');

    var fireImage;

    if (candleOn) {
      if (isBlowing) {
        // shaking
        fireImage = fireMovingImage;
      }
      else {
        // idle
        fireImage = fireIdleImage;
      }
    } else {
      // off
      fireImage = null;
    }

    return (
      <View style={styles.container}>
        <RNCamera
          ref={ref => {
            this.camera = ref;
          }}
          style={styles.preview}
          type={RNCamera.Constants.Type.front}
          androidCameraPermissionOptions={{
            title: 'Permission to use camera',
            message: 'We need your permission to use your camera',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
          androidRecordAudioPermissionOptions={{
            title: 'Permission to use audio recording',
            message: 'We need your permission to use your audio',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
        >
          <View
            style={{
              flex: 1,
              justifyContent:'center',
              alignItems:'center',
            }}>
            <TouchableWithoutFeedback
              onPress={()=>{this.rekindle()}}>
              <View
                style={{
                  position: 'absolute',
                  height: 30,
                  width: 100,
                  bottom: 250,
                }}>
                <Image
                  style={{
                    position: 'absolute',
                    width: 30,
                    height: 30,
                    left: 0,
                  }}
                  source={fireImage}/>
                <Image
                  style={{
                    position: 'absolute',
                    width: 30,
                    height: 30,
                    left: 35,  // a nasty hack to center this
                  }}
                  source={fireImage}/>
                <Image
                  style={{
                    position: 'absolute',
                    width: 30,
                    height: 30,
                    right: 0,
                  }}
                  source={fireImage}/>
              </View>
            </TouchableWithoutFeedback>
          <Image
              style={{
                position: 'absolute',
                width: 200,
                height: 200,
                bottom: 50,
              }}
              source={cakeImage}/>
          </View>
        </RNCamera>
      </View>
    );
  }

}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },
});
