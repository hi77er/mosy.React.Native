import React, { useContext, useState, useEffect } from "react";
import { StyleSheet } from "react-native";
import MultiSelect from "react-native-multiple-select";
import { Context as FiltersContext } from '../../context/FiltersContext';



const FiltersMultiSelect = ({ filterType, label }) => {
  const [multiselectRef, setMultiSelectRef] = useState(null);

  const { state, setSelectedFilters } = useContext(FiltersContext);

  const onSelectedItemsChange = (selectedFilterIds) => {
    setSelectedFilters({ filterType, selectedFilterIds });
  };

  return (
    <MultiSelect
      key={filterType}
      ref={(component) => setMultiSelectRef(component)}
      uniqueKey="id"
      displayKey="name"
      items={
        state.filters
          ? state.filters
            .filter(x => x.filterType == filterType)
            .sort((a, b) => a - b)
          : []
      }
      hideTags
      fixedHeight
      selectedItems={
        state.selectedFilters
          ? state.selectedFilters
            .filter(x => x.filterType == filterType)
            .map(x => x.id)
          : []
      }
      onSelectedItemsChange={onSelectedItemsChange}
      selectText={label}
      searchInputPlaceholderText="Search ..."
      styleDropdownMenuSubsection={styles.dropdownMenuSubsection}
      styleMainWrapper={styles.mainWrapper}
      styleSelectorContainer={styles.selectorContainer}
      styleInputGroup={styles.inputGroup}
      hideSubmitButton
      hideDropdown
      searchInputStyle={styles.searchInput}
      searchIcon={false} />
  );
};

const styles = StyleSheet.create({
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


export default FiltersMultiSelect;