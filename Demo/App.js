import React, {
  useState,
  useEffect,
} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  NativeModules,
  NativeEventEmitter,
  Button,
  Platform,
  PermissionsAndroid,
  FlatList,
  TouchableHighlight,
  Touchable,
  TouchableOpacity,
} from 'react-native';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';

import BleManager from 'react-native-ble-manager';
const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

const App = () => {
  const [isScanning, setIsScanning] = useState(false);
  const peripherals = new Map();
  const [list, setList] = useState([]);


  const startScan = () => {
    if (!isScanning) {
      BleManager.scan([], 10, true).then((results) => {
        console.log('Scanning...', results);
        setIsScanning(true);
      }).catch(err => {
        console.error(err);
      });
    }
  }

  const handleStopScan = () => {
    console.log('Scan is stopped');
    setIsScanning(false);
  }

  const handleDisconnectedPeripheral = (data) => {
    let peripheral = peripherals.get(data.peripheral);
    if (peripheral) {
      peripheral.connected = false;
      peripherals.set(peripheral.id, peripheral);
      setList(Array.from(peripherals.values()));
    }
    console.log('Disconnected from ' + data.peripheral);
  }

  const handleUpdateValueForCharacteristic = (data) => {
    console.log('Received data from ' + data.peripheral + ' characteristic ' + data.characteristic, data.value);
  }

  const retrieveConnected = () => {
    BleManager.getConnectedPeripherals([]).then((results) => {
      if (results.length == 0) {
        console.log('No connected peripherals')
      }
      console.log(results);
      for (var i = 0; i < results.length; i++) {
        var peripheral = results[i];
        peripheral.connected = true;
        peripherals.set(peripheral.id, peripheral);
        setList(Array.from(peripherals.values()));
      }
    });
  }

  const handleDiscoverPeripheral = (peripheral) => {
    console.log('Got ble peripheral', peripheral);
    if (!peripheral.name) {
      peripheral.name = 'NO NAME';
    }
    peripherals.set(peripheral.id, peripheral);
    setList(Array.from(peripherals.values()));
  }

  const testPeripheral = (peripheral) => {
    if (peripheral) {
      if (peripheral.connected) {
        BleManager.disconnect(peripheral.id);
      } else {
        BleManager.connect(peripheral.id).then(() => {
          let p = peripherals.get(peripheral.id);
          if (p) {
            p.connected = true;
            peripherals.set(peripheral.id, p);
            setList(Array.from(peripherals.values()));
          }
          console.log('Connected to ' + peripheral.id);
          BleManager.retrieveServices(peripheral.id).then((peripheralInfo) => {
            BleManager.readRSSI(peripheral.id).then((rssi) => {
              console.log('Retrieved actual RSSI value', rssi);
              let p = peripherals.get(peripheral.id);
              if (p) {
                p.rssi = rssi;
                peripherals.set(peripheral.id, p);
                setList(Array.from(peripherals.values()));
              }
            });
            console.log(peripheralInfo, "peripheralInfo");
            var service = 'd7522f9e-b65b-11ea-b3de-0242ac130004';
            var hyperCharacteristic = 'd752328c-b65b-11ea-b3de-0242ac130004';
            var charCharacteristic = 'd752328c-b65b-11ea-b3de-0242ac130004';
            setTimeout(() => {
              BleManager.write(peripheral.id, service, charCharacteristic, [60, 102, 0, 0, 0, 60]).then((res) => {
                console.log('Writed NORMAL crust', res);
                // For Battery Life Indicator data[12]=="battery %" and data[3]==1"Time_Out" or data[3]==0 "Time out ho gya hai"
                BleManager.read('A8:03:2A:E4:24:16', 'd7522f9e-b65b-11ea-b3de-0242ac130004', 'd752328c-b65b-11ea-b3de-0242ac130004').then((data) => { console.log(data, "useEffect data"); })
                // "v " + data[1] + "." + data[2] + "." + data[3] for device information
                BleManager.write(peripheral.id, service, hyperCharacteristic, [60, 102, 0, 0, 0, 60]).then(async (res) => {
                  console.log('Writed 351 temperature, the pizza should be BAKED', res);
                });
              });
            }, 500);
          });
        }).catch((error) => {
          console.log('Connection error', error);
        });
      }
    }
  }
  const writeSingleCoil = () => {
    let data = new Uint8Array([60, 101, 1, 1, 1, 0, 0, 62]);
    console.log(data), "qwerty";
    BleManager.write('A8:03:2A:E4:24:16', 'd7522f9e-b65b-11ea-b3de-0242ac130004', 'd752328c-b65b-11ea-b3de-0242ac130004', [60, 101, 1, 1, 1, 0, 0, 62]).then(async (res) => {
      console.log('writeSingleCoil', res);
    });

  }
  const stopGuitar = () => {
    let data = new Uint8Array([60, 103, 1, 1, 1, 1, 1, 62]);
    console.log(data), "qwerty";
    BleManager.write('A8:03:2A:E4:24:16', 'd7522f9e-b65b-11ea-b3de-0242ac130004', 'd752328c-b65b-11ea-b3de-0242ac130004', [60, 102, 62]).then(async (res) => {
      console.log('stopGuitar', res);
    });

  }

  useEffect(() => {
    BleManager.start({ showAlert: false });
    bleManagerEmitter.addListener('BleManagerDiscoverPeripheral', handleDiscoverPeripheral);
    bleManagerEmitter.addListener('BleManagerStopScan', handleStopScan);
    bleManagerEmitter.addListener('BleManagerDisconnectPeripheral', handleDisconnectedPeripheral);
    bleManagerEmitter.addListener('BleManagerDidUpdateValueForCharacteristic', handleUpdateValueForCharacteristic);

    if (Platform.OS === 'android' && Platform.Version >= 23) {
      PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION).then((result) => {
        if (result) {
          console.log("Permission is OK");
        } else {
          PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION).then((result) => {
            if (result) {
              console.log("User accept");
            } else {
              console.log("User refuse");
            }
          });
        }
      });
    }

    return (() => {
      console.log('unmount');
      bleManagerEmitter.removeListener('BleManagerDiscoverPeripheral', handleDiscoverPeripheral);
      bleManagerEmitter.removeListener('BleManagerStopScan', handleStopScan);
      bleManagerEmitter.removeListener('BleManagerDisconnectPeripheral', handleDisconnectedPeripheral);
      bleManagerEmitter.removeListener('BleManagerDidUpdateValueForCharacteristic', handleUpdateValueForCharacteristic);
    })
  }, []);

  const renderItem = (item) => {
    const color = item.connected ? 'green' : '#fff';
    return (
      <TouchableHighlight onPress={() => testPeripheral(item)}>
        <View style={[styles.row, { backgroundColor: color }]}>
          <Text style={{ fontSize: 12, textAlign: 'center', color: '#333333', padding: 10 }}>{item.name}</Text>
          <Text style={{ fontSize: 10, textAlign: 'center', color: '#333333', padding: 2 }}>RSSI: {item.rssi}</Text>
          <Text style={{ fontSize: 8, textAlign: 'center', color: '#333333', padding: 2, paddingBottom: 20 }}>{item.id}</Text>
        </View>
      </TouchableHighlight>
    );
  }

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          {global.HermesInternal == null ? null : (
            <View style={styles.engine}>
              <Text style={styles.footer}>Engine: Hermes</Text>
            </View>
          )}
          <View style={styles.body}>

            <View style={{ margin: 10 }}>
              <Button
                title={'Scan Bluetooth (' + (isScanning ? 'on' : 'off') + ')'}
                onPress={() => startScan()}
              />
            </View>

            <View style={{ margin: 10 }}>
              <Button title="Retrieve connected peripherals" onPress={() => retrieveConnected()} />
            </View>

            {(list.length == 0) &&
              <View style={{ flex: 1, margin: 20 }}>
                <Text style={{ textAlign: 'center' }}>No peripherals</Text>
              </View>
            }
            <TouchableOpacity style={{ height: 100, width: 100, backgroundColor: 'red' }} onPress={() => writeSingleCoil()}>

            </TouchableOpacity>
            <TouchableOpacity style={{ height: 100, width: 100, backgroundColor: 'green', marginTop: 20 }} onPress={() => stopGuitar()}>

            </TouchableOpacity>
          </View>
        </ScrollView>
        <FlatList
          data={list}
          renderItem={({ item }) => renderItem(item)}
          keyExtractor={item => item.id}
        />
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default App;