import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: "red"
    },
    loaderStyle: {
        flex: 1,
        height: '100%',
        width: '100%',
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'transparent',
        position: 'absolute',
        zIndex: 1,
        top: 0,
        bottom: 0,
        right: 0,
        left: 0
    }

});

export default styles;
