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

export default {
  reset,
  navigate,
  setContainer,
};
