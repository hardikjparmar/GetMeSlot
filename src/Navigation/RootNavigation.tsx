import {NavigationContainerRef} from '@react-navigation/native';

let navigationRef: NavigationContainerRef;

function setContainer(ref: NavigationContainerRef) {
  navigationRef = ref;
}

function navigate(name: string) {
  navigationRef.navigate(name);
}

function reset() {
  navigationRef.reset({
    index: 0,
    routes: [{name: 'LoginScreen'}],
  });
}

function reAuth(mobile: string) {
  navigationRef.reset({
    index: 0,
    routes: [{name: 'OTPScreen', params: {preFillMobileNumber: mobile}}],
  });
}

export default {
  reset,
  navigate,
  setContainer,
  reAuth,
};
