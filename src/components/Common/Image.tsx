import {ImageLoader} from 'react-native-image-fallback';

import {ICON_URL, IMG_URL} from '../../constants/Network';

interface ImageProps {
  og: boolean;
  url: string;
  dimension: number;
}

const Image = (props: ImageProps): JSX.Element => {
  return (
    <ImageLoader
      source={
        (props.og ? `${IMG_URL}` : '') +
        `${props.url}` +
        (props.og ? '.jpg' : '')
      }
      fallback={[`${ICON_URL}imagedefault.png`]}
      style={{
        height: props.dimension || 80,
        width: props.dimension || 80,
        borderRadius: 10,
        backgroundColor: 'transparent',
      }}
    />
  );
};

export default Image;
