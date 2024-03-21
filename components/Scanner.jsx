import React, { useState, useEffect } from "react";
import {
  Text,
  SafeAreaView,
  StyleSheet,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
} from "react-native";
import { Camera } from "expo-camera";
import { useRoute } from "@react-navigation/native";

const Scanner = () => {
  const [scanned, setScanned] = useState("");
  const [inventory, setInventory] = useState([]);
  const [matchingItem, setMatchingItem] = useState(null);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [newOrMatching, setNewOrMatching] = useState("");
  const [qty, setQty] = useState("");
  const route = useRoute();
  const { companyAccount, companyName } = route.params;

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const urlInventory = `https://ziggify-backend.onrender.com/inventory/${companyAccount}`;
        const res = await fetch(urlInventory);
        const data = await res.json();
        setInventory(data);
      } catch (err) {
        console.error("Error fetching inventory:", err);
      }
    };
    fetchInventory();
  }, [companyAccount]);

  useEffect(() => {
    const getPermission = async () => {
      if (!permission) {
        await requestPermission();
      }
    };
    getPermission();
  }, [permission, requestPermission]);

  useEffect(() => {
    if (newOrMatching !== "new" || newOrMatching !== "matching") {
      setMatchingItem(null);
      setQty("");
      setScanned("");
    }
  }, [newOrMatching]);

  const handleScan = async (scanningResult) => {
    const { data } = scanningResult;
    const foundItem = inventory.find((item) => item.upc === data);
    if (foundItem) {
      setMatchingItem(foundItem);
      setNewOrMatching("matching");
    } else {
      setMatchingItem(null);
      setNewOrMatching("new");
    }
    setScanned(data);
  };

  const submitUpdate = async () => {
    const currQty = matchingItem.qty;
    const newQty = Number(currQty) + Number(qty);
    const updatedItem = {
      _id: matchingItem._id,
      qty: newQty,
      date: new Date().toISOString(),
      companyAccount: companyAccount,
    };

    try {
      const response = await fetch(
        `https://ziggify-backend.onrender.com/inventory/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify([updatedItem]),
        }
      );
      if (response.ok) {
        setNewOrMatching("");
        console.log("Inventory updated successfully");
        const urlInventory = `https://ziggify-backend.onrender.com/inventory/${companyAccount}`;
        const res = await fetch(urlInventory);
        const data = await res.json();
        setInventory(data);
      } else {
        console.error("Failed to update inventory");
      }
    } catch (err) {
      setNewOrMatching("");
      console.error("Error updating inventory:", err);
    }
  };

  const submitNew = async () => {
    const dataToSend = {
      upc: scanned,
      qty: Number(qty),
      sku: scanned,
      date: new Date(),
      status: 'Incomplete',
      companyAccount: companyAccount,
    };
    try {
      const response = await fetch(
        "https://ziggify-backend.onrender.com/inventory/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataToSend),
        }
      );

      if (response.ok) {
        setNewOrMatching("");
        console.log("New item added successfully");
        const urlInventory = `https://ziggify-backend.onrender.com/inventory/${companyAccount}`;
        const res = await fetch(urlInventory);
        const data = await res.json();
        setInventory(data);
      } else {
        console.error("Failed to add new item");
      }
    } catch (err) {
      setNewOrMatching("");
      console.error("Error adding new item:", err);
    }
  };

  return (
    <SafeAreaView
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <Text style={{ margin: 10, fontSize: 20 }}>{companyName}</Text>
      {!permission ? (
        <Text>Loading...</Text>
      ) : !permission.granted ? (
        <Text>No access to camera</Text>
      ) : (
        <Camera
          ref={(ref) => {
            camera = ref;
          }}
          onBarCodeScanned={scanned ? undefined : handleScan}
          // autoFocus={Camera.Constants.AutoFocus.on}
          style={styles.camera}
        />
      )}
      {newOrMatching !== "new" || newOrMatching !== "matching" ? (
        <Text style={{ margin: 30 }}>Scan a barcode</Text>
      ) : null}
      {newOrMatching === "new" && (
        <>
          <Text style={{ fontSize: 20 }}>Create a new item</Text>
          <Text style={{ fontWeight: "bold" }}>{scanned}</Text>
          <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
            <TextInput
              style={{
                borderWidth: 1,
                padding: 2,
                borderRadius: 5,
                margin: 10,
                height: 30,
              }}
              placeholder="QTY"
              onChangeText={(text) => setQty(text)}
            />
          </KeyboardAvoidingView>
          <Pressable
            onPress={submitNew}
            style={{
              margin: 80,
              padding: 12,
              backgroundColor: "#F24822",
              borderRadius: 5,
            }}
          >
            <Text style={{ color: "white" }}>Submit</Text>
          </Pressable>
        </>
      )}
      {newOrMatching === "matching" && (
        <>
          <Text style={{ fontSize: 20 }}>Update this item</Text>
          <Text style={{ fontWeight: "bold" }}>{scanned}</Text>
          <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
            <TextInput
              style={{
                borderWidth: 1,
                padding: 2,
                borderRadius: 5,
                margin: 10,
                height: 30,
                width: 35,
              }}
              placeholder="QTY"
              onChangeText={(text) => setQty(text)}
            />
          </KeyboardAvoidingView>
          <Pressable
            onPress={submitUpdate}
            style={{
              margin: 80,
              padding: 12,
              backgroundColor: "#F24822",
              borderRadius: 5,
            }}
          >
            <Text style={{ color: "white" }}>Submit</Text>
          </Pressable>
        </>
      )}
    </SafeAreaView>
  );
};
export default Scanner;

const styles = StyleSheet.create({
  camera: {
    height: 200,
    width: "100%",
    borderWidth: 2,
  },
});
