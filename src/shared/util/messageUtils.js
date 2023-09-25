import Toast from "react-native-toast-message";

const showMessage = (type, text1, text2, position = "top") => {
  Toast.show({
    type,
    text1,
    text2,
    visibilityTime: 3000,
    autoHide: true,
    topOffset: 30,
    bottomOffset: 40,
    position: position,
  });
};

export default showMessage;
