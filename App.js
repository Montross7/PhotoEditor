/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState} from 'react';
import {
  Button,
  Image,
  SafeAreaView,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import RNFS from 'react-native-fs';
import ImagePicker from 'react-native-image-crop-picker';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import ImageFilter from './src/ImageFilter';
import {cleanExtractedImagesCache} from 'react-native-image-filter-kit';
import PhotoEditor from 'react-native-photo-editor';

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const [photoPath, setPhotoPath] = useState('');
  const [displayImage, setDisplayImage] = useState('');

  return (
    <SafeAreaView style={backgroundStyle}>
      <Button
        title="Select Photo"
        onPress={() => {
          ImagePicker.openPicker({
            width: 300,
            height: 400,
            cropping: false,
            multiple: true,
          })
            // MultipleImagePicker.openPicker()
            .then(image => {
              console.log(image);
              // setPhoto(image[0]);
              const fileName = image[0].path.split('\\').pop().split('/').pop();

              let imagePath = `${RNFS.DocumentDirectoryPath}/${fileName}`;
              console.log(imagePath);

              console.log(fileName, image);

              RNFS.moveFile(image[0]?.path, imagePath)
                .then(() => {
                  console.log('FILE WRITTEN!', imagePath);
                  // PhotoEditor.Edit({path: imagePath});
                  cleanExtractedImagesCache();
                  setPhotoPath(imagePath);
                })
                .catch(err => {
                  console.log(err.message);
                });
            })
            .catch(e => console.log(e));
        }}
      />
      {/* <Button
        title="Edit"
        onPress={() => {
          if (photoPath || photo) {
            PhotoEditor.Edit({path: photoPath});
            // PhotoEditor.Edit({path: photo.path});
          }
        }}
      /> */}
      {!!photoPath && (
        <ImageFilter
          photoPath={photoPath}
          onConfirm={val => {
            // setDisplayImage(val);
            PhotoEditor.Edit({
              path: val,
              onDone: val => {
                console.log(val);
                setDisplayImage(val);
              },
            });

            setPhotoPath('');
          }}
        />
      )}
      {!!displayImage && (
        <Image
          style={styles.image}
          source={{uri: displayImage}}
          resizeMode={'contain'}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  image: {
    width: 300,
    height: 400,
    marginVertical: 10,
    alignSelf: 'center',
  },
  filterSelector: {
    width: 100,
    height: 100,
    margin: 5,
  },
});

export default App;
