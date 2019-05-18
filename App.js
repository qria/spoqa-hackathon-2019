import React from 'react';
import RNSoundLevel from 'react-native-sound-level'
import Sound from 'react-native-sound';
import Confetti from 'react-native-confetti';
import { Image, StyleSheet, TouchableWithoutFeedback,
  TouchableOpacity, View } from 'react-native';
import { RNCamera } from 'react-native-camera';
import Emoji from 'react-native-emoji';


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
    this.applauseSound = new Sound('applause.mp3', Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.log('failed to load the sound', error);
        return;
      }
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

  applause() {
    this.applauseSound.play();
  }

  confetti() {
    if(this._confettiView) {
      this._confettiView.startConfetti();
    }
  }

  render() {
    const { candleOn, noiseLevel }  = this.state;
    const isBlowing = noiseLevel > BLOWING_THRESHHOLD;

    const cakeImage = require('./assets/cake_base.png');
    const fireIdleImage = require('./assets/fire_idle.png');
    const fireMovingImage = require('./assets/fire.gif');

    const musicNoteIcon = require('./assets/musicnote.png');
    const partyIcon = require('./assets/tada.png');
    const clapIcon = require('./assets/clap.png');

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
        <View
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            zIndex: 1,
          }}>
          <Confetti
            duration={4000}
            confettiCount={50}
            ref={(node) => this._confettiView = node}/>
        </View>

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
            justifyContent:'flex-end',
            alignItems:'center',
          }}>
          <Image
              style={{
                width: 302,
                height: 222,
              }}
              source={cakeImage}/>
            {/* <TouchableWithoutFeedback
              onPress={()=>{}}> */}
              <View
                style={{
                  position: 'absolute',
                  height: 30,
                  width: 120,
                  bottom: 210,
                  alignItems: 'space-around',
                  justifyContent: 'space-around',
                  flexDirection: 'row',
                }}>
                <Image
                  style={{
                    width: 30,
                    height: 30,
                  }}
                  source={fireImage}/>
                <Image
                  style={{
                    width: 30,
                    height: 30,
                  }}
                  source={fireImage}/>
                <Image
                  style={{
                    width: 30,
                    height: 30,
                  }}
                  source={fireImage}/>
              </View>
            {/* </TouchableWithoutFeedback> */}
          </View>
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              marginTop: 40,
              marginBottom: 31,
            }}
          >
            <TouchableOpacity
              style={{
                height: 76,
                width: 76,
                borderRadius: 38,
                borderColor: 'white',
                borderStyle: 'solid',
                borderWidth: 2,
                zIndex: 2,
                justifyContent: 'center',
                alignContent: 'center',
              }}
              onPress={() => {this.confetti()}}>
              <Image
                style={{
                  width: 50,
                  height: 50,
                  marginLeft: 11,
                  }}
                  source={musicNoteIcon}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                height: 76,
                width: 76,
                borderRadius: 38,
                borderColor: 'white',
                borderStyle: 'solid',
                borderWidth: 2,
                zIndex: 2,
                justifyContent: 'center',
                alignContent: 'center',
              }}
              onPress={() => {this.confetti()}}>
              <Image
                style={{
                  width: 50,
                  height: 50,
                  marginLeft: 11,
                  }}
                  source={partyIcon}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                height: 76,
                width: 76,
                borderRadius: 38,
                borderColor: 'white',
                borderStyle: 'solid',
                borderWidth: 2,
                zIndex: 2,
                justifyContent: 'center',
                alignContent: 'center',
              }}
              onPress={() => {this.applause()}}>
              <Image
                style={{
                  width: 50,
                  height: 50,
                  marginLeft: 11,
                  }}
                  source={clapIcon}
              />
            </TouchableOpacity>
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
});
