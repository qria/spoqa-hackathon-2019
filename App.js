import React from 'react';
import RNSoundLevel from 'react-native-sound-level'
import { StyleSheet, Text, View } from 'react-native';

const BLOWING_THRESHHOLD = -10;
const CANDLE_OFF_SECONDS = 3;

export default class App extends React.Component {
  state = {
    blowingSeconds: 0,
    candleOn: true,
    noiseLevel: null,
  }

  componentDidMount() {
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

  render() {
    const { blowingSeconds, candleOn, noiseLevel }  = this.state;
    const isBlowing = noiseLevel > BLOWING_THRESHHOLD;
    var text;
    if (candleOn) {
      if (isBlowing) {
        // shaking
        text = '흔들흔들';
      }
      else {
        // idle
        text = '불어보세요';
      }
    } else {
      // off
      text = '주금';
    }

    return (
      <View style={styles.container}>
        <Text> { text } </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
