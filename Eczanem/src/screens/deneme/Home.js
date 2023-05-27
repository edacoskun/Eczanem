import React, { useState, useEffect } from 'react'
import { Text, View, StyleSheet, FlatList, Button } from "react-native"
import { Auth, database } from '../../../components/config'
import {
    collection,
    addDoc,
    orderBy,
    query,
    onSnapshot
} from 'firebase/firestore';
const styles = StyleSheet.create({
    view: {
        width: "100%",
        height: "100%",
        padding: 25
    }
})

export default function Loginscreen({ navigation }) {

    const [user, setUser] = useState(null) // This user
    const [users, setUsers] = useState([]) // Other Users

    useEffect(() => {
        collection("users").doc(Auth.currentUser.uid).get()
            .then(user => {
                setUser(user.data())
            })
    }, [])

    useEffect(() => {
        if (user)
            collection("users").where("role", "==", (user?.role === "Student" ? "Teacher" : "Student"))
                .onSnapshot(users => {
                    if (!users.empty) {
                        const USERS = []

                        users.forEach(user => {
                            USERS.push(user.data())
                        })

                        setUsers(USERS)
                    }
                })
    }, [user])

    return <View>
        <View style={{ padding: 10, backgroundColor: "#b1b1b1", paddingTop: 55 }}>
            <Text style={{ fontSize: 24, fontWeight: "800" }}>Welcome {user?.name}</Text>
        </View>

        <View style={styles.view}>
            <Text style={{
                fontSize: 20,
                fontWeight: "600",
                marginBottom: 20
            }}
            >
                Here is the list of {user?.role === "Student" ? "Teachers" : "Students"}
            </Text>

            <View style={{ marginBottom: 40 }}>
                <FlatList
                    data={users}
                    renderItem={({ item }) => <View style={{ borderBottomWidth: 1, borderBottomColor: "#b1b1b1", marginBottom: 20 }}>
                        <Text style={{ fontSize: 18, fontWeight: "400", marginBottom: 8 }}>{item.name}</Text>
                    </View>}
                    keyExtractor={(item, index) => index.toString()}
                />
            </View>



            <Button title="Log Out" style={{ alignSelf: "center" }} onClick={() => Auth.signOut()} />
        </View>

    </View>
}