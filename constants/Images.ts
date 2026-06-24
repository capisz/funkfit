export const PepperImages = {
  happy: require('../assets/images/pepper.png'),
  wave: require('../assets/images/pepper-wave.png'),
  cheer: require('../assets/images/pepper-cheer.png'),
  flex: require('../assets/images/pepper-flex.png'),
  sleep: require('../assets/images/pepper-sleep.png'),
  sad: require('../assets/images/pepper-sad.png'),
  point: require('../assets/images/pepper-point.png'),
  think: require('../assets/images/pepper-think.png'),
  love: require('../assets/images/pepper-love.png'),
  highfive: require('../assets/images/pepper-highfive.png'),
  icon: require('../assets/images/pepper-icon.png'),
  iconRound: require('../assets/images/pepper-icon-round.png'),
  iconDark: require('../assets/images/pepper-icon-dark.png'),
} as const;

export type PepperPose = keyof typeof PepperImages;
