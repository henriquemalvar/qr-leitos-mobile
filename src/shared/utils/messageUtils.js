import Toast from "react-native-toast-message";

const showMessage = ({ type, text1, text2 = "", position = "bottom", autoHide = true, visibilityTime = 3000 }) => {
  Toast.show({
    type,
    text1,
    text2,
    visibilityTime,
    autoHide,
    topOffset: 50,
    bottomOffset: 40,
    position,
  });
};

export default showMessage;