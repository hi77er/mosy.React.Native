import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { Text } from 'react-native-elements';
import Modal, { ModalContent, ModalTitle } from 'react-native-modals';

const VenueFiltersModal = forwardRef((props, ref) => {
  const [isVisible, setIsVisible] = useState(false);

  const show = () => setIsVisible(true);
  const hide = () => setIsVisible(false);

  useImperativeHandle(ref, () => ({
    show,
    hide
  }));

  return (
    <Modal.BottomModal
      visible={isVisible}
      onTouchOutside={hide}
      onSwipeOut={hide}
      height={0.7}
      width={1}
      modalTitle={<ModalTitle hasTitleBar title="Venue filters" />}>
      <ModalContent style={{ flex: 1, backgroundColor: "white" }}>
        <Text>BottomModal with title</Text>
      </ModalContent>
    </Modal.BottomModal>
  )
});

export default VenueFiltersModal;
