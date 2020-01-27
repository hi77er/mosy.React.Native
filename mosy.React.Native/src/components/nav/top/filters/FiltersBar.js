import React, { Component, ComponentType, useRef, useState, forwardRef, useImperativeHandle } from "react";
import { Animated, Dimensions, StyleSheet, View, ScrollView } from "react-native";
import { Text } from 'react-native-elements';
import { TouchableOpacity } from "react-native-gesture-handler";
import MultiSelect from "react-native-multiple-select";

const FiltersBar = ({ filters }) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [multiselectRef, setMultiSelectRef] = useState(null);
  const [showClosed, setShowClosed] = useState(false);

  const onSelectedItemsChange = (selectedItems) => setSelectedItems(selectedItems);

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        contentContainerStyle={styles.filtersScroll}
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16} >
        <TouchableOpacity
          style={[showClosed ? styles.showClosedTrueTouch : styles.showClosedFalseTouch, styles.showClosedTouch]}
          onPress={() => setShowClosed(!showClosed)}>
          <View style={styles.showClosedContainer}>
            <Text style={[showClosed ? styles.showClosedLabel : styles.showClosedFalseLabel, styles.showClosedLabel]}>Show closed</Text>
          </View>
        </TouchableOpacity>
        {
          filters.map((filters, index) => (
            <MultiSelect
              key={index}
              ref={(component) => setMultiSelectRef(component)}
              uniqueKey="id"
              displayKey="name"
              items={filters.items}
              hideTags
              fixedHeight
              selectedItems={selectedItems}
              onSelectedItemsChange={onSelectedItemsChange}
              selectText={filters.label}
              searchInputPlaceholderText="Search ..."
              styleDropdownMenuSubsection={styles.dropdownMenuSubsection}
              styleMainWrapper={styles.mainWrapper}
              styleSelectorContainer={styles.selectorContainer}
              styleInputGroup={styles.inputGroup}
              hideSubmitButton
              hideDropdown
              searchInputStyle={styles.searchInput}
              searchIcon={false} />
          ))
        }
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: "row", backgroundColor: "#90002D", alignItems: "flex-start", },
  showClosedTouch: { height: 30, marginTop: 5, marginLeft: 5, marginRight: 10, borderWidth: 1, borderRadius: 8 },
  showClosedTrueTouch: { borderWidth: 0, borderColor: "white", backgroundColor: "white", },
  showClosedFalseTouch: { borderWidth: 1, borderColor: "#90002D", backgroundColor: "transparent", },
  showClosedContainer: { flex: 1, justifyContent: "center", paddingLeft: 8, paddingRight: 8 },
  showClosedLabel: { fontSize: 14 },
  showClosedTrueLabel: { color: "#555", },
  showClosedFalseLabel: { color: "white", fontWeight: "bold", },
  filtersScroll: { paddingLeft: 10, alignItems: "flex-start" },
  dropdownMenuSubsection: {
    // adjust filters buttons background here!
    borderRadius: 8,
    borderBottomColor: "transparent",
    height: 30,
    paddingLeft: 10, paddingRight: 0,
  },
  mainWrapper: { marginRight: 10, marginTop: 0, },
  selectorContainer: { marginTop: 5, elevation: 0, },
  inputGroup: { justifyContent: "flex-end", borderTopLeftRadius: 8, borderTopRightRadius: 8, },
  searchInput: { display: "none" },
});

export default FiltersBar;