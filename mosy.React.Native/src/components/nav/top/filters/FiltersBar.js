import React, { useContext, useState } from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import { Text } from 'react-native-elements';
import { TouchableOpacity } from "react-native-gesture-handler";
import FiltersMultiSelect from '../../../filters/FiltersMultiSelect';
import { Context as FiltersContext } from '../../../../context/FiltersContext';


const FiltersBar = ({ filteredType }) => {

  const { state, setShowClosedVenues, setShowClosedDishes, setShowNotRecommendedDishes } = useContext(FiltersContext);



  const renderFilterGroups = () => {
    let groups = null;
    if (filteredType == 1)
      groups = (
        <React.Fragment>
          <FiltersMultiSelect key={101} filterType={101} label="Accessibility" />
          <FiltersMultiSelect key={102} filterType={102} label="Availability" />
          <FiltersMultiSelect key={103} filterType={103} label="Athmosphere" />
          <FiltersMultiSelect key={104} filterType={104} label="Culture" />
        </React.Fragment>
      );
    else if (filteredType == 2)
      groups = (
        <React.Fragment>
          <FiltersMultiSelect key={201} filterType={201} label="Dish Type" />
          <FiltersMultiSelect key={205} filterType={205} label="Drink Type" />
          <FiltersMultiSelect key={203} filterType={203} label="Ingredient" />
          <FiltersMultiSelect key={202} filterType={202} label="Region" />
          <FiltersMultiSelect key={204} filterType={204} label="Allergen" />
        </React.Fragment>
      );
    return groups;
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        contentContainerStyle={styles.filtersScroll}
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}>
        {
          filteredType == 1
            ? (
              <TouchableOpacity
                style={[
                  state.showClosedVenues ? styles.boolFilterTrueTouch : styles.boolFilterFalseTouch,
                  styles.boolFilterTouch
                ]}
                onPress={() => setShowClosedVenues(!state.showClosedVenues)}>
                <View style={styles.boolFilterContainer}>
                  <Text
                    style={[
                      state.showClosedVenues ? styles.boolFilterLabel : styles.boolFilterFalseLabel, styles.boolFilterLabel
                    ]}>
                    Show closed
                  </Text>
                </View>
              </TouchableOpacity>
            )
            : (
              <TouchableOpacity
                style={[
                  state.showClosedDishes ? styles.boolFilterTrueTouch : styles.boolFilterFalseTouch,
                  styles.boolFilterTouch
                ]}
                onPress={() => setShowClosedDishes(!state.showClosedDishes)}>
                <View style={styles.boolFilterContainer}>
                  <Text
                    style={[
                      state.showClosedDishes ? styles.boolFilterLabel : styles.boolFilterFalseLabel, styles.boolFilterLabel
                    ]}>
                    Show closed
                  </Text>
                </View>
              </TouchableOpacity>
            )
        }
        {
          filteredType != 2 ? null
            : <TouchableOpacity
              style={[
                state.showNotRecommendedDishes ? styles.boolFilterTrueTouch : styles.boolFilterFalseTouch,
                styles.boolFilterTouch
              ]}
              onPress={() => setShowNotRecommendedDishes(!state.showNotRecommendedDishes)}>
              <View style={styles.boolFilterContainer}>
                <Text style={[state.showNotRecommendedDishes ? styles.boolFilterLabel : styles.boolFilterFalseLabel, styles.boolFilterLabel]}>Not recommended</Text>
              </View>
            </TouchableOpacity>
        }
        {renderFilterGroups()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: "row", backgroundColor: "#90002D", alignItems: "flex-start", },
  boolFilterTouch: { height: 30, marginTop: 5, marginLeft: 5, marginRight: 10, borderWidth: 1, borderRadius: 8 },
  boolFilterTrueTouch: { borderWidth: 0, borderColor: "white", backgroundColor: "white", },
  boolFilterFalseTouch: { borderWidth: 1, borderColor: "#90002D", backgroundColor: "transparent", },
  boolFilterContainer: { flex: 1, justifyContent: "center", paddingLeft: 8, paddingRight: 8 },
  boolFilterLabel: { fontSize: 14 },
  showClosedTrueLabel: { color: "#555", },
  boolFilterFalseLabel: { color: "white", fontWeight: "bold", },
  filtersScroll: { paddingLeft: 10, alignItems: "flex-start" },
});

export default FiltersBar;