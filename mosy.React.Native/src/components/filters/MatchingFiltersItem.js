import React, { useContext, useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-elements';
import { Context as FiltersContext } from '../../context/FiltersContext';


const MatchingFiltersItem = ({ matchingFiltersIds, mismatchingFiltersIds }) => {
  const [matchingFilterNames, setMatchingFilterNames] = useState([]);
  const [mismatchingFilterNames, setMismatchingFilterNames] = useState([]);
  const filtersContext = useContext(FiltersContext);
  const { filters } = filtersContext.state;


  useEffect(() => {
    if (matchingFiltersIds && matchingFiltersIds.length && filters && filters.length) {
      setMatchingFilterNames(
        filters
          .filter(f => matchingFiltersIds.includes(f.id))
          .map(f => f.name)
      );
      setMismatchingFilterNames(
        filters
          .filter(f => mismatchingFiltersIds.includes(f.id))
          .map(f => f.name)
      );
    }
  }, []);


  return (
    <View style={styles.container}>
      {!(matchingFilterNames && matchingFilterNames.length) || <Text style={styles.text}>{matchingFilterNames.join(', ')}</Text>}
      {!(mismatchingFilterNames && mismatchingFilterNames.length) || <Text style={styles.text}>{mismatchingFilterNames.join(', ')}</Text>}
    </View>
  );
};



const styles = StyleSheet.create({
  container: { backgroundColor: '#90002d', padding: 2 },
  text: { color: 'salmon', },
});

export default MatchingFiltersItem;