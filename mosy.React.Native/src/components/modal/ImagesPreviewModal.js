import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { Modal } from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';


const ImagesPreviewModal = forwardRef(({ images }, ref) => {

  const [imageModalVisible, setImageModalVisible] = useState(false);

  const show = () => setImageModalVisible(true);
  const hide = () => setImageModalVisible(false);

  useImperativeHandle(ref, () => ({
    show, hide
  }));

  return (
    <Modal visible={imageModalVisible} onRequestClose={hide}>
      <ImageViewer imageUrls={images} enableSwipeDown onSwipeDown={hide} />
    </Modal>
  );
});

export default ImagesPreviewModal;