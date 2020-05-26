//로그인 된 user의 책장을 모두 불러와서 보여주는 화면
import * as React from "react";
import { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  AsyncStorage,
  TouchableHighlightBase,
  Dimensions,
} from "react-native";
import { Button } from "react-native-elements";
import axios from "axios";
import Modal from "react-native-modal";
import Shelves from "../components/Shelves";
import { ScrollView } from "react-native-gesture-handler";
import my_ip from "../ipconfig.json";
import IDContext from "../hooks/IDContext";
const { width, height } = Dimensions.get("window");

export default function BookShelfScreen({ navigation }) {
  const { state } = React.useContext(IDContext);
  const [shelves, setShelves] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [newShelfName, setNewShelfName] = useState("");
  const user_id = state.userToken;

  useEffect(() => {
    shelfGetApiCall();
  }, []);

  const toggleModal = () => {
    setNewShelfName("");
    setModalVisible(!isModalVisible);
  };

  const pressRefresh = () => {
    console.log("refresh pressed(사실 새로고침은 필요없다)");
    shelfGetApiCall();
  };

  const pressAdd = () => {
    console.log("Add pressed");
    toggleModal();
  };

  const pressEdit = () => {
    console.log("edit pressed");
  };

  const pressDelete = () => {
    console.log("delete pressed");
  };

  const pressMake = () => {
    console.log("Make pressed");
    console.log(newShelfName);
    shelfPostApiCall();
    toggleModal();
  };

  const shelfGetApiCall = async () => {
    axios({
      method: "get",
      url: `http://${my_ip.my_ip}:3000/api/shelf/${user_id.email}`,
      params: {
        user_id: user_id.email,
      },
      //로그인된 아이디의 책장을 가져오기 위해서 파라미터를 넘겨줘야한다
    }).then(function (response) {
      setShelves(response.data);
    });
  };

  const shelfPostApiCall = () => {
    //여기에 새 책장을 POST하는 axios call을 한다
    axios({
      method: "post",
      url: `http://${my_ip.my_ip}:3000/api/shelf`,
      //만들려는 책장의 이름, 소유자를 넘겨줘야함
      params: {
        user_id: user_id.email,
        shelf_name: newShelfName,
      },
    }).then(function (response) {
      shelfGetApiCall();
    });
  };

  return (
    <View style={{ backgroundColor: "#ffffff", height: height }}>
      <Modal
        isVisible={isModalVisible}
        backdropOpacity={0.1}
        onBackdropPress={toggleModal}
      >
        <View style={{ backgroundColor: "white" }}>
          <Text
            style={{
              textAlign: "center",
              fontSize: 25,
              margin: 10,
            }}
          >
            책장 이름을 입력하세요
          </Text>
          <TextInput
            style={{
              fontSize: 22,
              marginHorizontal: 20,
              backgroundColor: "#eeeeee",
              marginBottom: 15,
            }}
            value={newShelfName}
            onChangeText={setNewShelfName}
          />
          <Button title={"만들기"} onPress={pressMake} />
        </View>
      </Modal>
      <View style={styles.manage}>
        <Button title={"책장 추가"} onPress={pressAdd} />
        <Button title={"책장 이름 수정"} onPress={pressEdit} />
        <Button title={"책장 삭제"} onPress={pressDelete} />
        <Button title={"새로고침"} onPress={pressRefresh} />
      </View>
      <View>
        {shelves ? (
          shelves.map((c, i) => {
            return (
              <Button
                buttonStyle={{ backgroundColor: "#3498db" }}
                style={{ margin: 5 }}
                key={i}
                title={c.shelf_name}
                id={c.shelf_num}
                onPress={() =>
                  navigation.navigate("shelf", {
                    shelf_num: c.shelf_num,
                  })
                }
              />
            );
            //return <Shelves key={i} name={c.shelf_name} />;
          })
        ) : (
          <View></View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  manage: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 5,
    marginTop: 5,
  },
});
