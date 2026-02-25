import { TextProps } from 'react-native';
import { Text } from '@/components/AppText'

export function MonoText(props: TextProps) {
  return <Text {...props} style={[props.style, { fontFamily: 'ClashGrotesk' }]} />;
}
