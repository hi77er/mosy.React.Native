import { listHelper } from './listHelper';

const checkFiltersStateChanged = (
  selectedFilterIds,
  preselectedFilterIds,
) => {
  return !listHelper.listEqualsIgnoreOrder(selectedFilterIds, preselectedFilterIds);
};

export const filtersHelper = {
  checkFiltersStateChanged,
};