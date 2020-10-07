import express from 'express';
import Expo from 'expo-server-sdk';

const app = express();
const expo = new Expo();

const savedPushTokens = [];
const PORT_NUMBER = 3000;

const saveToken = (token) => {
    if (savedPushTokens.indexOf(token) === -1) {
        savedPushTokens.push(token);
    }
}

const handelPushTokens = (message) => {
    let notifications = [];

    for (let pushToken of savedPushTokens) {
        if (!Expo.isExpoPushToken(pushToken)) {
            console.log('-------"ERROR"-------');
            console.log("ERROR");
            continue;
        }

        notifications.push({
            to: pushToken,
            sound: "default",
            title: "알림도착",
            body: message,
            data: { message }
        });
    }

    let chunks = expo.chunkPushNotifications(notifications);
    (async () => {
        for (let chunk of chunks) {
            try {
                let receipts = await expo.sendPushNotificationsAsync(chunk);
                console.log('-------receipts-------');
                console.log(receipts);
            } catch (error) {
                console.error(error);
            }
        }
    })();
}
app.use(express.json());
app.get('/', (req, res) => {
    res.send("작동중");
});

app.post('/token', (req, res) => {
    saveToken(req.body.token.value);
    console.log('-------"토큰저장"-------');
    console.log("토큰저장");
    res.send(`토큰 저장완료 ${req.body.token.value}`);
});

app.post('/message', (req, res) => {
    handelPushTokens(req.body.message);
    console.log('-------"메세지보내기"-------');
    console.log(req.body.message);
    res.send(`메세지 전송 ${req.body.message}`);
});

app.listen(PORT_NUMBER, () => {
    console.log("3000 번 포트 서버 실행");
});