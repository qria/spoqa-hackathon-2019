import React from 'react';
import RNSoundLevel from 'react-native-sound-level'
import Sound from 'react-native-sound';
import Confetti from 'react-native-confetti';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { RNCamera } from 'react-native-camera';
import LottieView from 'lottie-react-native';


const BLOWING_THRESHHOLD = -10;
const CANDLE_OFF_SECONDS = 3;

function loadSound(soundName) {
  // To add sound, add it first to xcode and android raw folder.
  // for details, see: https://github.com/zmxv/react-native-sound#basic-usage
  return new Sound(soundName, Sound.MAIN_BUNDLE, (error) => {
    if (error) {
      console.log('failed to load the sound', error);
      return;
    }
  });
}

export default class App extends React.Component {
  state = {
    blowingSeconds: 0,
    candleOn: true,
    noiseLevel: null,
  }

  componentDidMount() {

    // Loading sounds
    Sound.setCategory('Playback');

    this.applauseSounds = [
      loadSound('applause1.mp3'),
      loadSound('applause2.mp3'),
      loadSound('applause3.mp3'),
    ]
    this.happyBirthdaySong = loadSound('happy_birthday.mp3');
    this.tadaSound = loadSound('tada.mp3');

    // Loading Sound Level Detector
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
    // Turn candle on again
    this.setState({
      candleOn: true,
    })
  }

  sing() {
    // Happy birthday to you~
    this.happyBirthdaySong.play();
  }

  applause() {
    // Play a random applause sound
    const randomNumber = Math.floor(Math.random() * this.applauseSounds.length);
    this.applauseSounds[randomNumber].play();

    // Confetti time!
    if(!this._confettiView) {
      // not yet loaded
      return;
    }
    this._confettiView.startConfetti();
  }

  fireworks() {
    this.fireworksAnimation && this.fireworksAnimation.play();
    this.tadaSound.play();
  }

  render() {
    const { candleOn, noiseLevel }  = this.state;
    const isBlowing = noiseLevel > BLOWING_THRESHHOLD;

    const cakeImage = require('./assets/cake_base.png');
    const fireIdleImage = require('./assets/fire_idle.gif');
    const fireMovingImage = require('./assets/fire_moving.gif');

    const fireworksAnimation = require('./assets/fireworks_animation.json');

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
        <RNCamera
          ref={ref => {this.camera = ref;}}
          style={styles.camera}
          type={RNCamera.Constants.Type.front}
        />

        <LottieView ref={animation => {this.fireworksAnimation = animation;}}
          source={fireworksAnimation} loop={false} speed={0.4}/>

        <View style={styles.cakeContainer}>
          <Image style={styles.cakeBase} source={cakeImage}/>
          {/* <TouchableWithoutFeedback
            onPress={()=>{}}> */}
            <View style={styles.fireContainer}>
              <Image style={styles.fireImage} source={fireImage}/>
              <Image style={styles.fireImage} source={fireImage}/>
              <Image style={styles.fireImage} source={fireImage}/>
            </View>
          {/* </TouchableWithoutFeedback> */}
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={() => {this.sing()}}>
            <Image style={styles.buttonIcon} source={musicNoteIcon}/>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => {this.fireworks()}}>
            <Image style={styles.buttonIcon} source={partyIcon}/>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => {this.applause()}}>
            <Image style={styles.buttonIcon} source={clapIcon}/>
          </TouchableOpacity>
        </View>

        <Confetti
          confettiCount={50}  // small because of lag
          duration={3000}
          ref={(node) => this._confettiView = node}/>
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
  camera: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  fireContainer: {
    position: 'absolute',
    bottom: 210,
    height: 30,
    width: 120,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  fireImage: {
    width: 30,
    height: 30,
  },
  cakeContainer: {
    flex: 1,
    justifyContent:'flex-end',
    alignItems:'center',
  },
  cakeBase: {
    width: 302,
    height: 222,
  },
  buttonContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 40,
    marginBottom: 31,
  },
  button: {
    height: 76,
    width: 76,
    borderRadius: 38,
    borderColor: 'white',
    borderStyle: 'solid',
    borderWidth: 2,
    justifyContent: 'center',
    alignContent: 'center',
  },
  buttonIcon: {
    width: 50,
    height: 50,
    marginLeft: 11,
  },
});
