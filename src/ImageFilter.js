import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Button,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import {
  AdenCompat,
  BrannanCompat,
  BrooklynCompat,
  ClarendonCompat,
  EarlybirdCompat,
  GinghamCompat,
  HudsonCompat,
  InkwellCompat,
  KelvinCompat,
  LarkCompat,
  LofiCompat,
  MayfairCompat,
  MoonCompat,
  NashvilleCompat,
  PerpetuaCompat,
  RiseCompat,
  StinsonCompat,
  ToasterCompat,
  ValenciaCompat,
  WaldenCompat,
  WillowCompat,
  Xpro2Compat,
} from 'react-native-image-filter-kit';
import ImageResizer from 'react-native-image-resizer';

const FILTERS = [
  {
    title: 'Normal',
    filterComponent: AdenCompat,
  },
  // {
  //   title: 'Maven',
  //   filterComponent: MavenCompat,
  // },
  {
    title: 'Mayfair',
    filterComponent: MayfairCompat,
  },
  {
    title: 'Moon',
    filterComponent: MoonCompat,
  },
  {
    title: 'Nashville',
    filterComponent: NashvilleCompat,
  },
  {
    title: 'Perpetua',
    filterComponent: PerpetuaCompat,
  },
  {
    title: 'Rise',
    filterComponent: RiseCompat,
  },

  {
    title: 'Stinson',
    filterComponent: StinsonCompat,
  },
  {
    title: 'Brooklyn',
    filterComponent: BrooklynCompat,
  },
  {
    title: 'Earlybird',
    filterComponent: EarlybirdCompat,
  },
  {
    title: 'Clarendon',
    filterComponent: ClarendonCompat,
  },
  {
    title: 'Gingham',
    filterComponent: GinghamCompat,
  },
  {
    title: 'Hudson',
    filterComponent: HudsonCompat,
  },
  {
    title: 'Inkwell',
    filterComponent: InkwellCompat,
  },
  {
    title: 'Kelvin',
    filterComponent: KelvinCompat,
  },
  {
    title: 'Lark',
    filterComponent: LarkCompat,
  },
  {
    title: 'Lofi',
    filterComponent: LofiCompat,
  },
  {
    title: 'Toaster',
    filterComponent: ToasterCompat,
  },
  {
    title: 'Valencia',
    filterComponent: ValenciaCompat,
  },
  {
    title: 'Walden',
    filterComponent: WaldenCompat,
  },
  {
    title: 'Willow',
    filterComponent: WillowCompat,
  },
  {
    title: 'Xpro2',
    filterComponent: Xpro2Compat,
  },
  {
    title: 'Aden',
    filterComponent: AdenCompat,
  },
  //   {
  //     title: '_1977',
  //     filterComponent: _1977Compat,
  //   },
  {
    title: 'Brannan',
    filterComponent: BrannanCompat,
  },
];

const ImageFilter = props => {
  const {photoPath, onConfirm} = props;
  const extractedUri = useRef(photoPath);
  const [selectedFilterIndex, setIndex] = useState(0);

  const [mainImagePath, setMainImagePath] = useState('');
  const [templateImagePath, setTemplateImagePath] = useState('');

  const onExtractImage = ({nativeEvent}) => {
    extractedUri.current = nativeEvent.uri;
  };
  const onSelectFilter = selectedIndex => {
    setIndex(selectedIndex);
  };

  useEffect(() => {
    ImageResizer.createResizedImage(
      photoPath,
      1200,
      1800,
      'JPEG',
      100,
      0,
      undefined,
      false,
      {mode: 'contain', onlyScaleDown: false},
    )
      .then(val => {
        console.log(val);
        setMainImagePath(val.path);
      })
      .catch(err => console.error(err));

    ImageResizer.createResizedImage(
      photoPath,
      300,
      400,
      'JPEG',
      100,
      0,
      undefined,
      false,
      {mode: 'contain', onlyScaleDown: false},
    )
      .then(val => {
        console.log(val);
        setTemplateImagePath(val.path);
      })
      .catch(err => console.error(err));

    return () => {
      // cleanExtractedImagesCache();
    };
  }, []);

  const renderFilterComponent = useCallback(
    ({item, index}) => {
      const FilterComponent = item.filterComponent;
      const image = (
        <Image
          style={styles.filterSelector}
          source={{uri: templateImagePath}}
          resizeMode={'contain'}
        />
      );
      return (
        <TouchableOpacity onPress={() => onSelectFilter(index)}>
          <Text style={styles.filterTitle}>{item.title}</Text>
          <FilterComponent image={image} />
        </TouchableOpacity>
      );
    },
    [templateImagePath],
  );
  const SelectedFilterComponent = FILTERS[selectedFilterIndex].filterComponent;
  return (
    <>
      <SafeAreaView />
      {selectedFilterIndex === 0
        ? !!mainImagePath && (
            <Image
              style={styles.image}
              source={{uri: mainImagePath}}
              resizeMode={'contain'}
            />
          )
        : !!mainImagePath && (
            <SelectedFilterComponent
              onExtractImage={onExtractImage}
              extractImageEnabled={true}
              image={
                <Image
                  style={styles.image}
                  source={{uri: mainImagePath}}
                  resizeMode={'contain'}
                />
              }
            />
          )}
      {!!templateImagePath && (
        <FlatList
          data={FILTERS}
          keyExtractor={item => item.title}
          horizontal={true}
          renderItem={renderFilterComponent}
        />
      )}
      <Button
        title="Confirm"
        onPress={() => {
          onConfirm(extractedUri.current);
          // PhotoEditor.Edit({path: extractedUri.current});
        }}
      />
    </>
  );
};
const styles = StyleSheet.create({
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
  filterTitle: {
    fontSize: 12,
    textAlign: 'center',
  },
});

export default ImageFilter;
